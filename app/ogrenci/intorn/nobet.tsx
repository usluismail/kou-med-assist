import { useState } from "react";
import { TabScreen } from "@/components/med/TabScreen";
import { ShiftsScreen, SwapSheet } from "@/components/med/intern/ShiftsScreen";
import { styles } from "@/components/med/intern/styles";

export default function IntornNobet() {
  const [swapOpen, setSwapOpen] = useState(false);
  return (
    <TabScreen style={styles.root}>
      <ShiftsScreen onSwap={() => setSwapOpen(true)} />
      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} />
    </TabScreen>
  );
}
