import type { Metadata } from "next";
import { SettingsScreen } from "../components/SettingsScreen";

export const metadata: Metadata = {
  title: "Settings",
  description: "Gameplay settings for Chess Chess Revolution.",
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
