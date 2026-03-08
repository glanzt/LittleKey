"use client";

import { useRouter, usePathname } from "next/navigation";
import { GameProvider, useGame } from "@/lib/game-context";
import GameTopMenu from "@/components/game-top-menu";
import FeedbackWidget from "@/components/feedback-widget";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";

function PlayShell(props) {
  var children = props.children;
  var game = useGame();
  var router = useRouter();
  var pathname = usePathname();

  // Auth guard: force profile selection if no profile picked (except during game/summary)
  var needsProfile = game.sync.isAuthenticated && !game.activeProfile
    && pathname !== "/play/game" && pathname !== "/play/summary" && pathname !== "/play/profiles";

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
        <FeedbackWidget />
      </>
    );
  }

  return (
    <>
      {children}
      <FeedbackWidget />
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
