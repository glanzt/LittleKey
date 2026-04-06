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
      || currentPathname.indexOf("/play/coloring") === 0;
  }

  // Coloring ships with local-only progress first, so it stays accessible without a selected profile.
  var needsProfile = game.sync.isAuthenticated && !game.activeProfile
    && !allowsMissingProfile(pathname);

  if (needsProfile && pathname !== "/play/profiles") {
    router.replace("/play/profiles");
    return null;
  }

  if (game.sync.isAuthenticated) {
    return (
      <>
        <GameTopMenu
          user={game.sync.user}
          onProfiles={function() { router.push("/play/profiles"); }}
          onHome={function() { router.push("/play"); }}
          onDashboard={function() { router.push("/play/dashboard"); }}
          onSettings={function() { router.push("/play/settings"); }}
          onSignOut={game.handleSignOut}
        />
        <div style={{ paddingTop: TOP_BAR_HEIGHT }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {children}
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
