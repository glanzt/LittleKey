const BUCKET_SIZE = 10;

function shuffleIds(ids) {
  const next = [...ids];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function getDifficultyScore(level) {
  const tieBreaker = level.id / 1000;

  switch (level.config.type) {
    case 'counting': {
      switch (level.config.subType) {
        case 'howMany':
          return 1 + level.config.correctCount * 0.9 + level.config.options.length * 0.4 + tieBreaker;
        case 'tapCount':
          return 3 + (level.config.tapTarget ?? level.config.correctCount) * 1.1 + level.config.objects.length * 0.35 + tieBreaker;
        case 'whichGroup': {
          const totalObjects = (level.config.groups?.left.length ?? 0) + (level.config.groups?.right.length ?? 0);
          return 4 + level.config.correctCount + totalObjects * 0.35 + tieBreaker;
        }
        case 'quantityMatch': {
          const interactionWeight = {
            tapNumber: 2,
            tapGroupThenNumber: 4,
            dragNumberToGroup: 5,
            dragGroupToNumber: 5.5,
          }[level.config.interaction];

          return interactionWeight
            + level.config.correctCount * 0.85
            + level.config.options.length * 0.45
            + level.config.groups.length * 1.2
            + tieBreaker;
        }
      }
      break;
    }
    case 'shapes': {
      if (level.config.subType === 'findShape') {
        return 2 + level.config.shapes.length * 0.6 + tieBreaker;
      }
      if (level.config.subType === 'whatShape') {
        return 3 + (level.config.shapeOptions?.length ?? 0) * 0.7 + tieBreaker;
      }
      return 4 + (level.config.draggables?.length ?? 0) * 1.1 + tieBreaker;
    }
    case 'sorting': {
      if (level.config.subType === 'yesNo') {
        return 1.5 + tieBreaker;
      }
      if (level.config.subType === 'dragSort') {
        return 3.5 + level.config.objects.length * 0.9 + tieBreaker;
      }
      return 5 + level.config.objects.length * 0.8 + tieBreaker;
    }
    case 'silhouette': {
      if (level.config.subType === 'tapMatch') {
        return 4.5 + level.config.options.length * 0.9 + tieBreaker;
      }
      return 6.5 + level.config.options.length * 0.8 + level.config.silhouettes.length + tieBreaker;
    }
    case 'oddOneOut':
      return 4.8 + level.config.objects.length * 0.9 + tieBreaker;
    case 'visualOddOneOut': {
      const oddTypeWeight = {
        color: 1,
        size: 1.5,
        shape: 2,
        fill: 2.5,
        direction: 3.5,
        rotation: 4,
      }[level.config.oddType];

      return 7 + oddTypeWeight + level.config.items.length * 0.7 + tieBreaker;
    }
    case 'series': {
      const ruleWeight = {
        color: 1,
        shape: 1.2,
        size: 1.4,
        direction: 2,
        mixedToken: 2.6,
      }[level.config.ruleType];

      const interactionWeight = level.config.subType === 'dragToSlot' ? 1.4 : 0.6;
      return 9 + ruleWeight + interactionWeight + level.config.sequence.length * 0.6 + level.config.options.length * 0.4 + tieBreaker;
    }
    case 'initialSound': {
      const correctTargets = level.config.items.filter(item => item.startsWithTarget).length;
      return 12 + correctTargets * 1.2 + level.config.items.length * 0.7 + tieBreaker;
    }
  }

  return level.id + tieBreaker;
}

export function createDifficultyAwareOrder(levels) {
  const byDifficulty = [...levels].sort((left, right) => getDifficultyScore(left) - getDifficultyScore(right));
  const order = [];

  for (let index = 0; index < byDifficulty.length; index += BUCKET_SIZE) {
    const bucket = byDifficulty.slice(index, index + BUCKET_SIZE).map(level => level.id);
    order.push(...shuffleIds(bucket));
  }

  return order;
}

export function isValidLevelOrder(levelOrder, levels) {
  if (levelOrder.length !== levels.length) return false;

  const expectedIds = new Set(levels.map(level => level.id));
  const actualIds = new Set(levelOrder);

  if (actualIds.size !== levelOrder.length) return false;
  if (actualIds.size !== expectedIds.size) return false;

  for (const id of actualIds) {
    if (!expectedIds.has(id)) return false;
  }

  return true;
}

export function applyLevelOrder(levels, levelOrder) {
  const byId = new Map(levels.map(level => [level.id, level]));
  return levelOrder
    .map(id => byId.get(id))
    .filter(level => Boolean(level));
}
