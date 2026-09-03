export function CheckMark({ scale = 1 }: { scale?: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 50,
        height: 44,
        clipPath: "polygon(0 47%, 14% 32%, 35% 58%, 85% 0, 100% 14%, 35% 100%)",
        background: "#61f1ff",
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: "drop-shadow(0 0 7px #128dff)",
      }}
    />
  );
}
