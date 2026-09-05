# Reactant game engine

## Design direction

**Reactant** is a Rust-authored, React-like game engine for Unity, primarily
intended for turn-based games. Components define both UI and world objects,
share state through props, hooks, and context, and describe animation and
effects declaratively.

The engine targets a Dreamtides port in which all game-specific presentation
behavior lives in Rust. Unity remains the visual asset authoring environment
and executes reusable rendering, input, animation, and audio capabilities.

The design uses two interactive threads:

- Unity’s main thread runs display logic and reconciliation.
- A rules worker executes an action and publishes meaningful intermediate
  states, blocking when it needs a player choice.
- Independent AI simulations and abandoned runs finishing their computations
  may use additional workers.

The mobile performance baseline is native iPhone 17 and Galaxy S25
applications. Desktop WebGL remains supported. Mobile browsers are unsupported.

## Related information

These implementations establish the existing behavior and migration examples:

- Reactant’s current
  [application entry point](/Users/dthurn/battlement/crates/battlement-reactant/src/app.rs)
  and
  [runtime](/Users/dthurn/battlement/crates/battlement-reactant/src/runtime.rs)
  establish component ownership, reconciliation, and synchronous integration.
- Existing
  [layout motion](/Users/dthurn/battlement/crates/battlement-reactant/src/layout.rs)
  and
  [portals](/Users/dthurn/battlement/crates/battlement-reactant/src/portal.rs)
  provide useful foundations, but do not provide the entity identity contract
  specified here.
- Battlement’s
  [engine interface](/Users/dthurn/battlement/crates/battlement-native/src/engine.rs)
  and
  [Unity runner](/Users/dthurn/battlement/Packages/com.battlement.client/Runtime/Host/BattlementRunner.cs)
  establish the serial C ABI and main-thread host ownership.
- Dreamtides’
  [response builder](/Users/dthurn/dreamtides/rules_engine/src/display/src/core/response_builder.rs)
  and
  [renderer](/Users/dthurn/dreamtides/rules_engine/src/display/src/rendering/renderer.rs)
  demonstrate snapshot presentation and ordered animation groups.
- Dreamtides’
  [position overrides](/Users/dthurn/dreamtides/rules_engine/src/display/src/rendering/position_overrides.rs),
  [card rendering](/Users/dthurn/dreamtides/rules_engine/src/display/src/rendering/card_rendering.rs),
  and
  [effect application](/Users/dthurn/dreamtides/rules_engine/src/display/src/rendering/apply_card_fx.rs)
  demonstrate display-only placement, card views, and configurable effects.
- Dreamtides’
  [ObjectLayout](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Layout/ObjectLayout.cs),
  [GameContext](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Layout/GameContext.cs),
  and
  [Displayable](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Layout/Displayable.cs)
  establish existing layout, interaction, and object-lifetime responsibilities.
- Dreamtides’
  [Card](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Components/Card.cs),
  [Registry](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Services/Registry.cs),
  and
  [Service](/Users/dthurn/dreamtides/client/Assets/Dreamtides/Services/Service.cs)
  are the principal references for replacing game-specific C# abstractions.
- Dreamtides’
  [BattleState](/Users/dthurn/dreamtides/rules_engine/src/battle_state/src/battle/battle_state.rs)
  establishes current snapshot, prompt, continuation, and simulation concerns.
- [Taffy](https://github.com/DioxusLabs/taffy) supplies Rust Flexbox and Grid
  algorithms. Unity documents
  [Web performance constraints](https://docs.unity3d.com/6000.5/Documentation/Manual/webgl-performance.html)
  and
  [root-motion callbacks](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html)
  relevant to the host implementation.

## Project and ownership boundaries

Reactant and Battlement are separate projects. Reactant depends on Battlement;
Battlement never depends on Reactant.

| Responsibility | Owner |
|---|---|
| Components, hooks, context, reconciliation | Reactant shared runtime |
| UI components and UI-specific authoring | reactant-ui, within Reactant |
| World components, layout, transitions, effect selection | Reactant |
| Interactive rules execution and simulation adapters | Reactant |
| Game rules, semantic changes, presentation policies | The game’s Rust code |
| C ABI, commands, Unity execution, asset preparation | Battlement |
| Low-level host fakes | Battlement |
| Engine behavior tests through the public display | Reactant and its games |

The reactant-ui layer uses the shared component foundations. It is not a second
application runtime with an independent state hierarchy.

Battlement executes generic capabilities. For example, it can execute a
sequence of animation tracks, but it does not know that the sequence represents
drawing a card or castling.

Existing Reactant APIs may change. Useful implementations and familiar
component patterns should be retained, without compatibility wrappers whose
only purpose is preserving old callers.

## Rules execution and displayed state

A **checkpoint** is an immutable game-state snapshot accompanied by typed,
game-defined descriptions of what changed. Rules authors publish checkpoints
after coherent operations, rather than after individual field assignments.

The **presented state** is the checkpoint currently exposed to components and
input. It can lag behind rules computation.

For example, an action can publish:

```text
Card drawn → energy gained → action completed
```

Those are three coherent states to present in order. Internal bookkeeping
needed to draw the card does not produce additional checkpoints automatically.

### Authoring the rules function

Rules execute as ordinary synchronous Rust with a generic execution context.
The following examples illustrate API shape; incidental names are not fixed.

```rust
fn resolve<E: Execution<GameState>>(state: &mut GameState, cx: &mut E) {
    draw_card(state);
    cx.present(|| state.snapshot(), || Change::CardDrawn);

    let target = cx.choose(state, SelectTarget::new(state));
    apply_effect(state, target);
}
```

The context provides two important contracts:

- `present` accepts lazy builders for the snapshot and change description.
- `choose` accepts a typed choice specification and returns its typed answer.

Rules functions require neither cancellation results nor cancellation
unwinding.

The game supplies its state, action, change, prompt, and answer types. Reactant
does not impose Dreamtides enums, a collection library, or a particular
copy-on-write representation.

### Snapshot ownership and backpressure

The publication channel holds at most one pending checkpoint.

- The worker reserves publication capacity before constructing a snapshot.
- The snapshot builder runs to completion on the worker.
- It returns an owned, immutable, `Send + 'static` value.
- Only then does the worker continue mutating its private state.
- Shared portions of snapshots must remain immutable.

No reference into worker-mutable storage may escape through a snapshot.
Immutable sharing is encouraged, but Rust types alone do not prove this
contract for structures with interior mutability.

The currently presented snapshot, one pending snapshot, and worker-owned
mutable state have separate lifetimes. This bounds retained publication
history without forcing deep copies or persistent collections.

The worker can run ahead through ordinary computation, but it cannot build an
arbitrary checkpoint backlog.

### Prompts

Interactive `choose` constructs an owned prompt representation and snapshot,
publishes them in order, and waits for an answer.

- A prompt cannot bypass an earlier checkpoint’s required presentation.
- It becomes actionable only when its own snapshot is presented.
- One prompt is outstanding within an interactive action.
- The prompt’s rules state and choice specification remain unchanged while
  waiting.
- Local menus, settings, inspection, and display stores may continue changing.

Each prompt has a run ID and request ID identifying that immutable
specification. A materially different legal-answer set requires a new request.

The interactive adapter validates answers before returning them to rules code:

- Stale run/request IDs cannot affect the worker.
- An invalid answer leaves the same prompt unanswered and produces public
  invalid-answer feedback.
- A valid answer resumes the synchronous rules function.

### Completion and saving

The worker’s completion record contains its final state and a final checkpoint.
That checkpoint participates in the same presentation sequence as all others.

The final state becomes the accepted completed-action state only after:

1. The final checkpoint is presented.
2. Its required presentation cue has been reached.
3. The host has given it a rendering opportunity.

At that point, the next gameplay action and saving become available.

Saving at a prompt or another intermediate checkpoint is unsupported. There
is no thread-stack serialization or continuation replay mechanism.

Persistence belongs to the game and executes outside the rules worker.
A persistence failure does not reverse an accepted in-memory action.

### Abandonment

Quitting or replacing a game abandons its run. It does not cancel its Rust
computation.

| Worker position | Behavior after abandonment |
|---|---|
| Waiting for publication capacity | Wake and return normally |
| Constructing a snapshot | Finish construction and discard it |
| Waiting for a prompt answer | Wake and invoke the automatic choice policy |
| Encountering another prompt | Invoke the automatic choice policy |
| Publishing another checkpoint | Return without invoking its builders |
| Returning its final state | Drop the result without accepting or saving it |

Abandonment marks the endpoint inactive, detaches its receivers, and discards
queued output. The main thread also checks run identity when accepting output,
so a result racing with abandonment cannot affect a replacement game.

The game supplies a nonblocking automatic choice policy covering every
supported prompt. It must produce valid answers and terminate. This policy
allows an abandoned function to reach its ordinary end.

Workers are detached; Unity’s main thread never joins an active worker.
Worker-owned memory is released when execution returns. Process shutdown need
not wait for abandoned runs.

Finite rules execution is an application contract. Arbitrary infinite loops
are not forcibly terminated.

### Purity and failures

The worker may own ordinary Rust memory and shared immutable game data. It
must not own application resource handles, perform persistence or networking,
or mutate externally visible application state.

Display services are not supplied through its execution context. Rust cannot
statically prevent arbitrary user code from violating purity; the ownership
boundary makes the intended contract explicit.

An active worker panic becomes a visible execution failure at the worker
boundary. The game retains its last accepted completed-action state and offers
exit/restart instead of accepting further gameplay actions.

Failures in abandoned runs cannot poison a new game.

## AI simulation and previews

Simulation uses the same rules function with a concrete execution context.

- `present` does not invoke snapshot or change builders.
- `choose` invokes the concrete policy inline.
- The engine’s simulation primitives introduce no channels, dynamic dispatch,
  UI prompt construction, or mandatory allocations.
- Independent simulations own independent mutable states and may share
  immutable game data.

Game-owned candidate construction and choice algorithms can have costs of
their own. The engine cannot guarantee that arbitrary user code allocates
nothing.

The specialization requirement must be verified with public-entrypoint
benchmarks, allocation traces, and optimized-code inspection. Generic syntax
alone is not evidence of zero overhead.

Display previews use the same rules function with an appropriate choice policy.
Their resulting state is rendered through the normal display interface.

## Components, state, and identity

A component can contribute world objects and UI through one logical hierarchy.
That hierarchy determines hooks, context, event propagation, and cleanup.

Physical placement is separate:

- World hosts belong to Unity transform hierarchies.
- UI hosts belong to explicit UI documents or portal containers.
- Layout membership determines placement without defining game-state ownership.
- A UI node is not implicitly parented to a Unity transform.

A card component can, for example, produce a prefab and a details-panel
contribution:

```rust
(
    Prefab::new(card_assets.standard)
        .bind(CardParts::Title, card.name)
        .on_click(move |_| selection.inspect(card_id)),
    Portal::to(details_panel)
        .child(CardDetails::new(card_id)),
)
```

The details component can use the same selection context and game snapshot to
decide what it displays.

### Display state and subscriptions

Components read the presented game snapshot through explicit props or optional
selector subscriptions.

- Local interaction state belongs in hooks or typed stores.
- Context supplies settings, assets, camera controls, and action dispatch.
- Display handlers can dispatch game actions but cannot mutate worker state.
- A selector suppresses component evaluation when its selected value is equal.
- Explicit props remain a complete authoring path.

External-store writes enqueue notifications. Rendering reads a stable store
version; subsequent writes are handled in a later pass rather than causing an
unbounded same-frame stabilization loop.

Ordinary animation playback does not update component state every frame.
Motion values that can execute in the host remain there.

### Identity across layouts

Ordinary keys remain sibling-scoped.

An **entity boundary** explicitly preserves its descendant component state
across changes of logical parent. Its **presentation identity** is a typed key
identifying one presentation instance across the mounted application’s active
logical roots.

```rust
HandLayout::new().children(hand.iter().map(|id| {
    Entity::new((*id, CardViewRole::Primary))
        .child(Card::new(*id))
}))
```

Moving that boundary into a battlefield layout preserves its matched
components, hooks, refs, and compatible live hosts.

The reconciliation contract is:

- Index committed entity boundaries application-wide.
- Match a proposed boundary before reconciling its descendants.
- Diagnose duplicate active identities before committing anything.
- Extract moved entities before destroying their former ancestors.
- Resolve context from the new logical ancestry.
- Clean up dependent effects before installing their replacements.

A primary card and its inspection copy use different presentation identities
while sharing game data.

### Host replacement and removal

A native host is reusable only when its native kind and binding contract remain
compatible. A world entity can retain a stable transform root while replacing
its visual children.

Incompatible content is prepared before visual replacement. A host is never
silently changed into an incompatible native kind.

When an entity disappears:

- Its logical component tree unmounts.
- Input handlers and subscriptions detach.
- **Exit visuals** retain frozen host representations, animation tracks, and
  required assets until visual work finishes.
- Exit visuals do not remain live component trees.

Reintroducing the same key after an absence creates a new incarnation. Old
retained visuals and callbacks cannot receive the new component’s input.

## Unity assets and reusable capabilities

Unity-authored prefabs and Rust-authored object composition are both supported.

Prefabs expose explicit named, typed bindings for:

- Text, artwork, renderers, and material parameters.
- Visibility and visual variants.
- Colliders and interaction regions.
- Effect, projectile, and attachment anchors.
- Animator and locomotion configuration.

A missing required part or incompatible binding fails preparation. It does not
partially replace the current presentation.

Bindings refer to object incarnations, so callbacks or effects cannot
accidentally target a recycled object.

Game-specific code does not move into a generic C# service merely because it
is complex. For example, a reusable shader-parameter animation capability
belongs in Battlement; choosing when a Dreamtides card dissolves belongs in
Rust.

## Input and interaction

World objects expose click, hover, press, and drag callbacks using the same
component and hook patterns as UI.

Input always targets the committed presentation:

- Capture and bubbling follow logical ancestry.
- Portals preserve that logical event path.
- Native default prevention remains synchronous.
- Unity performs geometric hit testing and pointer capture.
- Rust decides game-specific eligibility, interaction modes, and actions.

Modal surfaces have an explicit order. The top applicable modal excludes
targets outside its allowed interaction scope.

Native UI blocks world targets unless its surface explicitly allows
passthrough. World hit candidates are ordered by declared interaction layer,
visible depth, and stable sibling order for exact ties.

Captured pointers retain their target until release or removal. Removal emits
capture loss.

New game-changing actions are enabled only at a presented decision point:

- At a prompt, only valid answers to that prompt are accepted.
- At a completed-action boundary, the next gameplay action may begin.
- There is no speculative gameplay input queue.
- Inspection, menus, and settings remain available during presentation.

## World layout

UI retains Unity’s native layout. World Flexbox and Grid use Taffy in Rust;
custom Rust algorithms handle fans, piles, arcs, and other game arrangements.
Taffy supplies the underlying Flexbox and Grid algorithms.
[Taffy source](https://github.com/DioxusLabs/taffy)

The two domains share authoring concepts without promising identical
pixel-space and world-space measurements.

```rust
WorldFlex::new()
    .plane(table_plane)
    .extent((12.0, 3.0))
    .gap(0.1)
    .children(cards)
```

### Measurement and planes

A world layout declares:

- An origin and orthogonal basis vectors for increasing layout X and Y.
- An available extent in world units.
- Ordered child identities and layout boxes.
- The layout algorithm and its parameters.

Layout boxes use explicit sizes or authored rest-bounds metadata, including
pivots. Animated bounds never feed back into layout.

If runtime measurement is necessary, dependent layout waits for a cached host
measurement instead of committing a guessed pose. Changed measurements
invalidate dependent layout ancestors.

Box resizing does not stretch a mesh unless scaling is requested. Orientation
alignment is explicit; placing an object in a plane does not implicitly change
its authored facing.

Custom layouts are pure functions of these inputs and return target transforms.
They do not call Unity during layout computation.

### Rules location versus displayed placement

Layout tags belong to the game. Reactant contains no built-in Dreamtides zone
enum.

A card can remain in the same rules zone while a browser, prompt, or local
interaction changes its displayed placement. This replaces imperative
position-override chains with ordinary Rust presentation logic.

## Movement and layout transitions

Every active layout change that changes an object’s pose has a movement
transition. Equal poses complete without movement.

Applications provide a root default movement policy. Entity and ancestor
policies can override it, resolving from the new logical ancestry.

A policy receives:

- Source and destination layouts and transforms.
- Stable object and anchor references.
- The checkpoint’s typed semantic changes.
- The application’s movement configuration.

Unhandled transitions fall through to the root policy. Authors therefore do
not need to enumerate every source/destination pair.

Initial connection or restoration has no previous visible pose to preserve.
New objects use entry behavior; removed objects use exit behavior. These
operations are distinct from moving an already visible object.

### Continuous retargeting

The host starts replacement movement from the actual displayed pose when the
command is applied. Rust does not need continuous pose round trips.

- Layout-space changes convert through world coordinates.
- Reflow preserves the movement track and its arrival cue.
- Springs preserve velocity.
- A fixed-duration tween restarts its configured duration from the current pose.
- Repeated reflow can postpone arrival; when the layout stabilizes, the track
  completes normally.
- Hover offsets compose separately from base layout movement.

Drag takes explicit ownership of placement when interaction eligibility allows
it. Release returns the object smoothly to its newest valid destination.

### Root-motion locomotion

A reusable locomotion adapter accepts a game-supplied route, animation
configuration, speed, and arrival tolerance.

It consumes Unity root-motion deltas, maps progress along the supplied route,
and smoothly corrects the final segment. Only that adapter writes the base
transform while locomotion owns it. Unity exposes the relevant animation
callback and movement deltas.
[Unity root-motion callback](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html)

- The game supplies a valid route or unobstructed direct path.
- Reactant does not find routes around obstacles.
- Arrival requires the configured positional tolerance and terminal locomotion
  state.
- Lack of progress beyond the configured timeout reports failure.
- Failure never produces a silent teleport or an indefinite presentation wait.

Presentation movement does not determine authoritative game outcomes.

## Timelines and presentation pacing

A **timeline** is an immutable Rust-built description of sequential and
parallel tracks, with named cues that coordinate movement and effects.

Ordinary Rust chooses and constructs the plan:

```rust
sequence([
    move_to(card, reveal_layout),
    parallel([flip(card), play_sound(config.flip_sound)]),
    move_to(card, hand_layout),
    cue(CardInHand),
])
.advance_at(CardInHand)
.alongside(cosmetic_trail(card))
```

The checkpoint may advance at `CardInHand` while the trail continues.

### Playback ownership

Reactant compiles timelines into host-executable tracks and cue dependencies.

- Unity advances curves and fixed dependencies locally.
- Synchronizing a sound or starting a known successor track does not require a
  component rerender or a round trip for every cue.
- Game-specific decisions and construction of replacement plans remain Rust.
- The fake implements the same observable playback contract.

Cycles, missing cues, and required dependencies on infinite cosmetic loops are
rejected before playback.

Cues at the same timestamp execute in declaration order. Completion follows
cues at the terminal timestamp.

### Required and cosmetic work

Each checkpoint has one required advancement gate. It defaults to completion
of required movement; authored timelines may select an earlier cue.

- Required checkpoints are presented in order.
- A prompt cannot bypass an earlier gate.
- Cosmetic and persistent effects do not delay advancement.
- The host must give a checkpoint a rendering opportunity before the next
  required checkpoint replaces it.

The host records this opportunity with a frame generation. The fake provides
the corresponding `advance_frame` operation.

### Replacement and failure

Events carry timeline instance and generation identities. Each track produces
one terminal result: completed, interrupted, or failed.

- Layout retargeting preserves the existing required cue.
- Rust may replace an unfinished required timeline only with a successor
  responsible for the same checkpoint gate.
- Unity executes retargeting policy but does not independently choose
  game-specific replacement timelines.
- Cosmetic tracks may stop freely.
- Stale events cannot release a successor’s gate.

A required-track failure abandons the worker and stops that action’s
presentation. The last accepted completed-action state remains available, and
the display shows a failure surface with exit/restart actions.

Failure is an explicit abandonment path. Ordinary replacement cannot simply
discard an unsatisfied required gate.

## Effects and configuration

Effects distinguish desired ongoing state from individual occurrences.

- Persistent effects, such as a card’s aura, are keyed desired children.
- Transient effects, such as a sound or projectile, belong to a checkpoint
  occurrence.

A transient identity combines the run, checkpoint, change index, and stable
effect slot. Multiple intended instances use distinct slots.

These identities are fixed when the checkpoint is first accepted. Rendering
again or delivering the same host work again cannot replay the effect.
Connecting a new session presents current state without replaying historical
transients.

### Channels and layers

An **effect channel** selects one configured alternative. Independent channels
and layers combine.

For example, Rust can produce:

```rust
movement_sound.select([
    MoveCase::Castle,
    MoveCase::Rook,
    MoveCase::Default,
]);

check_sound.select([CheckCase::OpponentInCheck]);
```

The first configured movement alternative wins. The check sound remains
independent.

- Rust determines semantic cases and fallback order.
- Configuration supplies assets and parameters.
- Missing optional alternatives produce silence or absence.
- A missing required alternative fails preparation.
- There is no inferred specificity, global numeric priority system, or
  Boolean expression language.

### Optional RON

All configuration has ordinary Rust types and constructors. RON is an optional
way to populate those values.

```ron
(
    default_move_seconds: 0.25,
    sounds: {
        DefaultMove: "audio/move",
        Castle: "audio/castle",
        OpponentInCheck: "audio/check",
    },
)
```

RON may contain constants, asset references, case parameters, and channel
overrides. It does not contain loops, conditionals, timeline definitions, or
another programming language.

Rust owns case selection and sequence construction. Active timelines retain
their captured configuration; future timelines use current configuration.
No hot-reload service is required.

### Targets and lifetime

Effects target stable presentation references and typed prefab anchors.

- Attached effects follow a live target.
- Projectile and burst constructors explicitly select live-following or
  captured-at-start positions.
- Required targets and assets are prepared before playback.
- An active effect retains the visual and anchor handles it needs after
  logical removal.
- Retention does not retain input handlers or component subscriptions.
- Retained handles refer to the old incarnation, never a replacement object.

Visual resources are released after their final effect or exit use ends.
The runtime owns these lifetimes instead of allowing arbitrary cycles of
strong object references.

## Commit and performance contract

A render operates against a stable presented snapshot and store version. It
builds the proposed tree, resolves identities and layouts, selects effects,
and prepares assets and bindings.

Preparation may span frames while the previous presentation remains visible
and interactive.

At commit:

- Dependency-ordered host changes and handler tables advance as one generation.
- Input cannot observe a partially applied generation.
- Assets and large initial populations may be prepared inactive.
- The final visible swap must fit within one frame.
- Unexpected host failure stops the session instead of exposing a partial
  interactive state.

Old resources remain only where exit or effect retention requires them.

### Work that must remain bounded

The synchronous design requires more than fast rules computation:

- Avoid rebuilding and serializing unchanged subtrees and properties.
- Localize world-layout invalidation.
- Remove unconditional quadratic sibling and mutation planning on the
  reference workload.
- Keep ordinary motion playback host-local.
- Make geometry and motion observations opt-in.
- Batch reconciliation without delaying immediate default-prevention decisions.
- Bound frame admission instead of draining arbitrary pending history.
- Prepare assets before gameplay transitions.

A separate reconciliation thread would not remove Unity object-application or
rendering costs.

### Performance acceptance

The proposed reference fixture contains 300 complete Dreamtides-style card
views across 30 layouts. A 500-card fixture measures additional stress and
headroom.

The reference includes:

- Sparse updates and mass layout changes.
- Thirty simultaneous movement/effect tracks.
- Prompt, menu, and inspection interaction.
- Concurrent AI simulation.
- Fixed assets and seeds, with node, text, and material counts recorded.

Initial engineering requirements are:

| Measurement | Reference target |
|---|---:|
| Rust render, layout, and reconciliation, p95 update cost | ≤2 ms |
| Complete Reactant/Battlement main-thread CPU work, p95 | ≤4 ms |
| Average application frame rate | ≥59 FPS |
| Application frame interval, p99 | ≤18.34 ms |
| Workload-attributable frame after warmup | ≤33.34 ms |
| Local menu/hover response | Within two rendered frames |

These are design targets, not existing measured results.

Captures record device, OS, resolution, graphics settings, refresh cap, build
configuration, and AI worker count. Use release builds, warmup, and at least ten
minutes of sustained operation to expose thermal behavior.

GPU time, allocations, queue depth, and state-to-visible latency are recorded
separately. Low reconciliation cost cannot compensate for excessive native
rendering work. Unity specifically identifies draw-call dispatch overhead as
a Web performance concern.
[Unity Web performance guidance](https://docs.unity3d.com/6000.5/Documentation/Manual/webgl-performance.html)

Desktop WebGL uses an actual threaded release build with cross-origin isolation,
`SharedArrayBuffer`, and native threading support. Its recorded test
machine/browser must meet the reference thresholds; this does not claim
support for every desktop hardware configuration.

Existing 200-element UI motion workloads provide instrumentation and regression
grounding. They do not establish performance for hundreds of complete cards.

## Dreamtides adaptation

The port replaces ownership and orchestration while preserving implemented
game behavior.

| Current abstraction | Reactant representation |
|---|---|
| `ResponseBuilder` and renderer sequencing | Checkpoints and timelines |
| `position_overrides` | Rust presentation state selecting layouts |
| `CardService` identity dictionary | Entity reconciliation and stable refs |
| `LayoutForPosition` | Game-defined Rust layout selection |
| `ObjectLayout` subclasses | Pure Rust layout algorithms |
| `Card` | Composed prefab bindings, faces, interaction, and effects |
| `Registry` and `Service` | Typed contexts and ordinary Rust state |
| `GameContext` | Semantic Rust context projected to rendering/input fields |
| `CardAnimationService` | Rust-built declarative timelines |
| `apply_card_fx` | Case/channel selection and effect declarations |

The engine must express the following without game-specific C# behavior:

- Battle and quest card arrangements.
- Hidden/revealed cards and battlefield/normal visual variants.
- Draw, reveal, and hand placement.
- Draft, shop, quest-deck, and related transitions.
- Browsers and deck-order prompts.
- Drag cancellation and successful play.
- Simultaneous primary and inspection views.
- Outcome previews.
- Trails, projectiles, and persistent effects.
- Dissolve removal and reverse dissolve synchronized with appearance.

Existing Unity assets can remain. Complex C# components become smaller Rust
components bound to explicit prefab parts.

The rules runner does not require retaining Dreamtides’ existing internal
continuation queues. It also does not invent new game rules or fill unrelated
unimplemented rule variants.

## Public-display validation

Primary automated coverage consists of black-box Rust scenarios through the
public display driver and Battlement fakes.

No inline Rust test modules or private implementation unit tests are introduced.

The fake must support:

- Virtual presentation time and intermediate interpolation.
- Timeline cue ordering and terminal events.
- Input routing, capture, and modal behavior.
- Presented objects, text, transforms, and anchors.
- Effect and audio occurrences.
- Public checkpoint and prompt synchronization.

Tests coordinate real rules workers through public barriers rather than
wall-clock sleeps.

Representative scenarios include:

```rust
display.play(draw_action);
display.advance_to(CardInHand);
display.card(card_id).assert_in(hand_layout);
display.assert_energy(previous_energy);

display.advance_to_next_checkpoint();
display.assert_energy(previous_energy + 1);
```

Coverage includes:

- Transfers between every configured layout pair.
- State and ref retention across ancestry changes.
- Independent primary and inspection presentations.
- Reflow and retargeting during motion.
- Default movement and bespoke sequences.
- Channel fallback and independent effect layers.
- Transient deduplication across rerenders and repeated delivery.
- Exit retention for dissolves and projectiles.
- Ordered prompts with responsive menus.
- Invalid and stale answers.
- Abandonment during publication, snapshot construction, and prompt waits.
- Automatic answers to subsequent abandoned prompts.
- Suppression of abandoned final results.
- Simulation results rendered through the same public display.

Public simulation benchmarks verify primitive overhead. Tests do not assert
private queue structures or scheduler fields.

The fake does not claim to render actual particles, shaders, text rasterization,
or locomotion clips. Deterministic fixtures exercise their public contracts;
native scenarios verify actual Unity behavior.

Existing fake operations that jump directly to tween endpoints or ignore audio
behavior must be extended before this coverage can be claimed.

## Manual QA

A reference scene provides draw/reveal, zone transfers, browsers, deck-order
prompts, drag return/play, inspection, shop/quest transitions, mixed effects,
dissolve/reverse dissolve, and a character following a supplied route.

A public presentation inspector exposes:

- Presented checkpoint and prompt.
- Presentation identities and incarnations.
- Layout targets and current transforms.
- Active timelines, cues, and effects.
- Timing, allocation, and publication counters.

Pause, slow-playback, and single-frame controls make intermediate behavior
inspectable.

Exercise the reference flows and verify:

- Objects move continuously and retain expected state.
- Required cues occur in order.
- Cosmetic effects do not unnecessarily delay decisions.
- Removed objects remain visually available only as long as needed.
- Sounds, shaders, particles, text, and root motion match their assets.
- Modal input and UI/world contributions behave consistently.

Resize and reorient during motion. Open menus and inspect cards while a prompt
is pending. Abandon both publishing and waiting runs, start a new game, and
verify that old answers and results cannot affect it.

Verify that saving is unavailable mid-action and that restoration uses the last
accepted completed-action state.

Run sustained release performance captures on iPhone 17, Galaxy S25, and the
recorded desktop WebGL machine/browser under concurrent AI load. Inspect slow
frames and input latency as well as average FPS.

Controlled-time Ditto scenarios establish repeatable visual behavior.
Wall-clock device runs establish performance.
