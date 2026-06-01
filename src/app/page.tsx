import GSAPConfig     from "@/components/shared/GSAPConfig";
import LockedScreen   from "@/components/shared/LockedScreen";

/**
 * Root route — shown when a visitor navigates to the bare domain
 * without a personalized slug.
 */
export default function Home() {
  return (
    <>
      <GSAPConfig />
      <LockedScreen />
    </>
  );
}
