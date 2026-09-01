import { useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { TabScreen } from "@/components/med/TabScreen";
import { ApprovalList } from "@/components/med/faculty/ApprovalList";
import { styles } from "@/components/med/faculty/styles";
import { usePendingApprovals } from "@/lib/api/hooks";

export default function AkademisyenOnaylar() {
  const pending = usePendingApprovals();
  const skipFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (skipFirstFocus.current) {
        skipFirstFocus.current = false;
        return;
      }
      pending.reload();
    }, [pending.reload]),
  );

  return (
    <TabScreen style={styles.root}>
      <ApprovalList
        items={pending.data}
        loading={pending.loading}
        error={pending.error}
        onRetry={pending.reload}
        onChanged={pending.reload}
      />
    </TabScreen>
  );
}
