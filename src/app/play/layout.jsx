"use client";

import { useRouter, usePathname } from "next/navigation";
import { GameProvider, useGame } from "@/lib/game-context";
import GameTopMenu from "@/components/game-top-menu";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";

function PlayShell(props) {
  var children = props.children;
  var game = useGame();
  var router = useRouter();
  var pathname = usePathname();

  function allowsMissingProfile(currentPathname) {
    return currentPathname === "/play/game"
      || currentPathname === "/play/summary"
      || currentPathname === "/play/profiles"
      || currentPathname.indexOf("/play/coloring") === 0
      || currentPathname.indexOf("/play/gan-sheli") === 0;
  }

  var needsProfile = game.sync.isAuthenticated && !game.activeProfile
    && !allowsMissingProfile(pathname);

  if (needsProfile && pathname !== "/play/profiles") {
    router.replace("/play/profiles");
    return null;
  }

  // Immersive full-screen games render their own top bar + back button.
  // The global menu (fixed, z-index 250) would overlap those controls, so hide it.
  var isImmersive = pathname.indexOf("/play/gan-sheli") === 0
    || pathname.indexOf("/play/alefbet") === 0;

  if (isImmersive) {
    return <>{children}</>;
  }

  return (
    <>
      <GameTopMenu
        user={game.sync.isAuthenticated ? game.sync.user : null}
        onSignOut={game.handleSignOut}
      />
      <div style={{ paddingTop: TOP_BAR_HEIGHT }}>
        {children}
      </div>
    </>
  );
}

export default function PlayLayout(props) {
  return (
    <GameProvider>
      <PlayShell>{props.children}</PlayShell>
    </GameProvider>
  );
}
