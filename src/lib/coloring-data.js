export var COLORING_PALETTE = [
  { id: 1, hex: "#ef4444", light: "#f47272", dark: "#cc2a2a", name: "אדום" },
  { id: 2, hex: "#f97316", light: "#fa934a", dark: "#d95e0e", name: "כתום" },
  { id: 3, hex: "#fcd34d", light: "#fddf7a", dark: "#dbb420", name: "צהוב" },
  { id: 4, hex: "#22c55e", light: "#50d47e", dark: "#1a9a49", name: "ירוק" },
  { id: 5, hex: "#3b82f6", light: "#6ba0f8", dark: "#1d6cf2", name: "כחול" },
  { id: 6, hex: "#a855f7", light: "#c083f9", dark: "#8b31f4", name: "סגול" },
  { id: 7, hex: "#ec4899", light: "#f175b3", dark: "#d62777", name: "ורוד" },
  { id: 8, hex: "#92400e", light: "#b35a1a", dark: "#6d3009", name: "חום" },
  { id: 9, hex: "#64748b", light: "#8694a8", dark: "#4b5563", name: "אפור" },
  { id: 10, hex: "#22d3ee", light: "#55dff3", dark: "#0eb8cc", name: "תכלת" },
];

export function getArtworkViewport(artwork) {
  var viewBox = artwork.viewBox || "0 0 500 500";
  var parts = viewBox.split(/\s+/).map(Number);
  var minX = parts[0] || 0;
  var minY = parts[1] || 0;
  var rawWidth = parts[2] || 500;
  var rawHeight = parts[3] || 500;
  var width = Number.isFinite(rawWidth) && rawWidth > 0 ? rawWidth : 500;
  var height = Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 500;
  return { viewBox: viewBox, minX: minX, minY: minY, width: width, height: height };
}

export function getUsedColorIds(paths) {
  return Array.from(new Set(paths.map(function(path) { return path.colorId; })));
}

export function isArtworkComplete(paths, filled) {
  return paths.every(function(path) { return !!filled[path.id]; });
}

export function countFilledRegions(paths, filled) {
  return paths.filter(function(path) { return !!filled[path.id]; }).length;
}

export function getCompletedColorGroups(paths, filled) {
  return new Set(getUsedColorIds(paths).filter(function(colorId) {
    return paths.filter(function(path) { return path.colorId === colorId; }).every(function(path) {
      return !!filled[path.id];
    });
  }));
}

export function getArtworkDifficultyScore(artwork) {
  return getUsedColorIds(artwork.paths).length;
}

export function getArtworkDifficultyMeta(artwork) {
  var score = getArtworkDifficultyScore(artwork);
  var level = score <= 5 ? 1 : score <= 7 ? 2 : 3;
  return {
    score: score,
    level: level,
    label: level === 1 ? "קליל" : level === 2 ? "בינוני" : "מאתגר",
  };
}

export var COLORING_ARTWORKS = [
  {
    id: "boat",
    title: "הסירה הקטנה",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 260 L 0 260 Z", labelX: 70, labelY: 50 },
      { id: "sun", colorId: 3, d: "M 410 70 A 42 42 0 1 0 494 70 A 42 42 0 1 0 410 70", labelX: 452, labelY: 70 },
      { id: "cloud-l", colorId: 9, d: "M 35 110 Q 28 90 50 86 Q 60 68 88 78 Q 98 58 128 70 Q 148 56 156 76 Q 174 73 172 92 Q 170 108 150 110 L 50 110 Q 28 114 35 110 Z", labelX: 100, labelY: 95 },
      { id: "cloud-r", colorId: 9, d: "M 218 148 Q 210 130 232 126 Q 242 108 268 118 Q 282 102 305 112 Q 325 100 328 118 Q 346 118 343 136 Q 340 150 322 152 L 230 152 Q 210 155 218 148 Z", labelX: 278, labelY: 138 },
      { id: "water", colorId: 5, d: "M 0 258 L 500 258 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "waves", colorId: 10, d: "M 0 250 Q 42 234 84 250 Q 126 266 168 250 Q 210 234 252 250 Q 294 266 336 250 Q 378 234 420 250 Q 462 266 500 255 L 500 278 Q 462 262 420 278 Q 378 294 336 278 Q 294 262 252 278 Q 210 294 168 278 Q 126 262 84 278 Q 42 294 0 278 Z", labelX: 440, labelY: 266 },
      { id: "hull", colorId: 8, d: "M 118 348 L 382 348 L 350 422 L 150 422 Z", labelX: 250, labelY: 390 },
      { id: "deck", colorId: 2, d: "M 133 300 L 367 300 L 382 348 L 118 348 Z", labelX: 250, labelY: 326 },
      { id: "mast", colorId: 8, d: "M 244 98 L 256 98 L 256 300 L 244 300 Z", labelX: 240, labelY: 195 },
      { id: "sail-main", colorId: 1, d: "M 248 110 L 248 286 L 106 286 Z", labelX: 182, labelY: 248 },
      { id: "sail-fore", colorId: 3, d: "M 253 124 L 253 282 L 392 282 Z", labelX: 318, labelY: 244 },
      { id: "pennant", colorId: 7, d: "M 248 98 L 222 83 L 248 68 Z", labelX: 232, labelY: 83 },
      { id: "porthole", colorId: 10, d: "M 222 368 A 22 22 0 1 0 266 368 A 22 22 0 1 0 222 368", labelX: 244, labelY: 368 },
      { id: "seagull", colorId: 9, d: "M 152 198 Q 164 186 175 198 Q 187 186 199 198 Q 188 204 175 198 Q 163 204 152 198 Z", labelX: 175, labelY: 193 },
    ],
  },
  {
    id: "house",
    title: "הבית השמשי",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 330 L 0 330 Z", labelX: 55, labelY: 45 },
      { id: "sun", colorId: 3, d: "M 60 45 A 38 38 0 1 0 136 45 A 38 38 0 1 0 60 45", labelX: 98, labelY: 45 },
      { id: "cloud", colorId: 9, d: "M 275 68 Q 267 50 289 46 Q 300 30 325 40 Q 340 24 363 34 Q 382 24 385 43 Q 403 43 400 60 Q 398 74 380 76 L 290 76 Q 267 80 275 68 Z", labelX: 340, labelY: 60 },
      { id: "grass", colorId: 4, d: "M 0 395 Q 125 375 250 390 Q 375 405 500 385 L 500 500 L 0 500 Z", labelX: 460, labelY: 448 },
      { id: "pathway", colorId: 2, d: "M 218 450 L 282 450 L 300 500 L 200 500 Z", labelX: 250, labelY: 475 },
      { id: "wall", colorId: 3, d: "M 148 272 L 352 272 L 352 452 L 148 452 Z", labelX: 175, labelY: 365 },
      { id: "chimney", colorId: 8, d: "M 305 190 L 305 148 L 338 148 L 338 225 Z", labelX: 321, labelY: 165 },
      { id: "smoke", colorId: 9, d: "M 312 138 A 14 14 0 1 0 340 138 A 14 14 0 1 0 312 138", labelX: 326, labelY: 138 },
      { id: "roof", colorId: 1, d: "M 108 275 L 250 128 L 392 275 Z", labelX: 250, labelY: 215 },
      { id: "door", colorId: 8, d: "M 210 348 L 290 348 L 290 452 L 210 452 Z", labelX: 250, labelY: 405 },
      { id: "door-arch", colorId: 6, d: "M 210 348 A 40 40 0 0 0 290 348 Z", labelX: 250, labelY: 325 },
      { id: "window-l", colorId: 10, d: "M 163 294 L 220 294 L 220 340 L 163 340 Z", labelX: 191, labelY: 317 },
      { id: "window-r", colorId: 10, d: "M 280 294 L 337 294 L 337 340 L 280 340 Z", labelX: 308, labelY: 317 },
      { id: "flower-l", colorId: 7, d: "M 68 428 A 20 20 0 1 0 108 428 A 20 20 0 1 0 68 428", labelX: 88, labelY: 428 },
      { id: "flower-r", colorId: 1, d: "M 393 428 A 20 20 0 1 0 433 428 A 20 20 0 1 0 393 428", labelX: 413, labelY: 428 },
    ],
  },
  {
    id: "rocket",
    title: "הטיל הקסום",
    category: "library",
    paths: [
      { id: "space-bg", colorId: 6, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 440, labelY: 450 },
      { id: "moon", colorId: 3, d: "M 345 72 A 45 45 0 1 0 435 72 A 45 45 0 1 0 345 72", labelX: 390, labelY: 72 },
      { id: "planet", colorId: 2, d: "M 32 352 A 58 58 0 1 0 148 352 A 58 58 0 1 0 32 352", labelX: 90, labelY: 352 },
      { id: "planet-ring", colorId: 10, d: "M 14 360 Q 90 332 166 360 Q 90 388 14 360 Z", labelX: 90, labelY: 360 },
      { id: "star-1", colorId: 3, d: "M 420 282 L 425 297 L 440 297 L 428 306 L 432 321 L 420 312 L 408 321 L 412 306 L 400 297 L 415 297 Z", labelX: 420, labelY: 302 },
      { id: "rocket-body", colorId: 10, d: "M 195 178 L 195 322 L 305 322 L 305 178 Z", labelX: 210, labelY: 200 },
      { id: "rocket-nose", colorId: 1, d: "M 195 178 Q 250 58 305 178 Z", labelX: 250, labelY: 138 },
      { id: "fin-l", colorId: 1, d: "M 195 272 L 122 348 L 195 318 Z", labelX: 162, labelY: 316 },
      { id: "fin-r", colorId: 1, d: "M 305 272 L 378 348 L 305 318 Z", labelX: 338, labelY: 316 },
      { id: "stripe", colorId: 2, d: "M 195 282 L 305 282 L 305 300 L 195 300 Z", labelX: 210, labelY: 291 },
      { id: "window", colorId: 5, d: "M 222 220 A 28 28 0 1 0 278 220 A 28 28 0 1 0 222 220", labelX: 250, labelY: 220 },
      { id: "hatch", colorId: 9, d: "M 220 268 L 280 268 L 280 288 L 220 288 Z", labelX: 250, labelY: 278 },
      { id: "flame-outer", colorId: 2, d: "M 205 322 L 250 448 L 295 322 Z", labelX: 250, labelY: 408 },
      { id: "flame-inner", colorId: 3, d: "M 222 322 L 250 392 L 278 322 Z", labelX: 250, labelY: 368 },
    ],
  },
  {
    id: "butterfly",
    title: "הפרפר הצבעוני",
    category: "new",
    paths: [
      { id: "wing-tl", colorId: 6, d: "M 250 242 Q 175 148 105 188 Q 68 228 105 272 Q 155 308 250 274 Z", labelX: 108, labelY: 260 },
      { id: "wing-tr", colorId: 2, d: "M 250 242 Q 325 148 395 188 Q 432 228 395 272 Q 345 308 250 274 Z", labelX: 392, labelY: 260 },
      { id: "wing-bl", colorId: 4, d: "M 250 274 Q 178 308 150 378 Q 160 428 215 408 Q 247 388 250 294 Z", labelX: 162, labelY: 400 },
      { id: "wing-br", colorId: 1, d: "M 250 274 Q 322 308 350 378 Q 340 428 285 408 Q 253 388 250 294 Z", labelX: 338, labelY: 400 },
      { id: "spot-tl", colorId: 3, d: "M 143 232 A 22 22 0 1 0 187 232 A 22 22 0 1 0 143 232", labelX: 165, labelY: 232 },
      { id: "spot-tr", colorId: 5, d: "M 313 232 A 22 22 0 1 0 357 232 A 22 22 0 1 0 313 232", labelX: 335, labelY: 232 },
      { id: "spot-bl", colorId: 10, d: "M 175 372 A 15 15 0 1 0 205 372 A 15 15 0 1 0 175 372", labelX: 190, labelY: 372 },
      { id: "spot-br", colorId: 7, d: "M 295 372 A 15 15 0 1 0 325 372 A 15 15 0 1 0 295 372", labelX: 310, labelY: 372 },
      { id: "body", colorId: 8, d: "M 243 210 Q 238 252 243 308 Q 250 325 257 308 Q 262 252 257 210 Q 250 200 243 210 Z", labelX: 250, labelY: 265 },
      { id: "head", colorId: 7, d: "M 234 196 A 16 16 0 1 0 266 196 A 16 16 0 1 0 234 196", labelX: 250, labelY: 196 },
      { id: "antenna-l", colorId: 9, d: "M 244 183 L 240 179 L 210 147 Q 205 141 210 136 Q 215 131 221 136 Q 227 141 250 179 Z", labelX: 220, labelY: 156 },
      { id: "antenna-r", colorId: 9, d: "M 256 183 L 260 179 L 290 147 Q 295 141 290 136 Q 285 131 279 136 Q 273 141 250 179 Z", labelX: 280, labelY: 156 },
    ],
  },
  {
    id: "tree",
    title: "עץ הקסמים",
    category: "library",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 368 L 0 368 Z", labelX: 30, labelY: 55 },
      { id: "sun", colorId: 3, d: "M 62 45 A 35 35 0 1 0 132 45 A 35 35 0 1 0 62 45", labelX: 97, labelY: 45 },
      { id: "ground", colorId: 4, d: "M 0 385 Q 125 365 250 380 Q 375 395 500 375 L 500 500 L 0 500 Z", labelX: 450, labelY: 445 },
      { id: "trunk", colorId: 8, d: "M 228 365 L 272 365 L 265 478 L 235 478 Z", labelX: 250, labelY: 425 },
      { id: "foliage-bot", colorId: 4, d: "M 108 370 L 392 370 L 325 260 L 175 260 Z", labelX: 250, labelY: 330 },
      { id: "foliage-mid", colorId: 4, d: "M 145 272 L 355 272 L 292 178 L 208 178 Z", labelX: 250, labelY: 240 },
      { id: "foliage-top", colorId: 4, d: "M 185 190 L 315 190 L 250 95 Z", labelX: 250, labelY: 168 },
      { id: "star", colorId: 3, d: "M 250 55 L 258 76 L 280 77 L 262 91 L 269 113 L 250 100 L 231 113 L 238 91 L 220 77 L 242 76 Z", labelX: 250, labelY: 87 },
      { id: "apple-1", colorId: 1, d: "M 177 310 A 18 18 0 1 0 213 310 A 18 18 0 1 0 177 310", labelX: 195, labelY: 310 },
      { id: "apple-2", colorId: 1, d: "M 232 290 A 18 18 0 1 0 268 290 A 18 18 0 1 0 232 290", labelX: 250, labelY: 290 },
      { id: "apple-3", colorId: 1, d: "M 287 310 A 18 18 0 1 0 323 310 A 18 18 0 1 0 287 310", labelX: 305, labelY: 310 },
      { id: "bird-l", colorId: 2, d: "M 55 192 Q 67 181 78 192 Q 89 181 100 192 Q 89 198 78 192 Q 67 198 55 192 Z", labelX: 78, labelY: 206 },
      { id: "bird-r", colorId: 2, d: "M 368 162 Q 380 151 391 162 Q 402 151 413 162 Q 402 168 391 162 Q 380 168 368 162 Z", labelX: 391, labelY: 178 },
    ],
  },
  {
    id: "fish",
    title: "הדג השמח",
    category: "new",
    paths: [
      { id: "water", colorId: 5, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 460 },
      { id: "body", colorId: 2, d: "M 140 250 Q 140 170 250 170 Q 360 170 360 250 Q 360 330 250 330 Q 140 330 140 250 Z", labelX: 280, labelY: 250 },
      { id: "tail", colorId: 2, d: "M 345 250 L 430 175 L 430 325 Z", labelX: 395, labelY: 250 },
      { id: "eye", colorId: 9, d: "M 182 225 A 18 18 0 1 0 218 225 A 18 18 0 1 0 182 225", labelX: 200, labelY: 225 },
      { id: "fin-top", colorId: 3, d: "M 230 172 L 270 95 L 310 172 Z", labelX: 270, labelY: 135 },
      { id: "fin-bottom", colorId: 7, d: "M 250 328 L 285 395 L 320 328 Z", labelX: 285, labelY: 365 },
      { id: "stripe", colorId: 10, d: "M 180 238 L 330 238 L 330 262 L 180 262 Z", labelX: 255, labelY: 250 },
      { id: "bubble1", colorId: 10, d: "M 106 188 A 15 15 0 1 0 136 188 A 15 15 0 1 0 106 188", labelX: 121, labelY: 188 },
      { id: "bubble2", colorId: 10, d: "M 90 135 A 11 11 0 1 0 112 135 A 11 11 0 1 0 90 135", labelX: 101, labelY: 135 },
      { id: "seaweed", colorId: 4, d: "M 395 500 Q 380 440 395 380 Q 420 310 400 270 L 415 270 Q 435 310 450 380 Q 435 440 420 500 Z", labelX: 410, labelY: 400 },
    ],
  },
  {
    id: "kite",
    title: "העפיפון הצבעוני",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 460 },
      { id: "kite-tl", colorId: 1, d: "M 250 80 L 150 230 L 250 230 Z", labelX: 215, labelY: 180 },
      { id: "kite-tr", colorId: 6, d: "M 250 80 L 350 230 L 250 230 Z", labelX: 285, labelY: 180 },
      { id: "kite-bl", colorId: 3, d: "M 150 230 L 250 230 L 250 380 Z", labelX: 215, labelY: 290 },
      { id: "kite-br", colorId: 2, d: "M 350 230 L 250 230 L 250 380 Z", labelX: 285, labelY: 290 },
      { id: "bow1", colorId: 7, d: "M 230 415 L 250 400 L 270 415 L 250 425 Z", labelX: 250, labelY: 412 },
      { id: "bow2", colorId: 4, d: "M 220 450 L 250 438 L 280 450 L 250 462 Z", labelX: 250, labelY: 450 },
      { id: "cloud-l", colorId: 9, d: "M 30 100 Q 22 80 45 76 Q 55 60 82 68 Q 95 52 115 62 Q 132 54 135 72 Q 148 72 145 88 Q 143 102 125 105 L 45 105 Q 22 108 30 100 Z", labelX: 85, labelY: 88 },
      { id: "cloud-r", colorId: 9, d: "M 360 150 Q 353 132 375 128 Q 385 112 410 122 Q 422 108 440 118 Q 455 108 458 125 Q 470 128 468 142 Q 466 155 450 158 L 375 158 Q 353 160 360 150 Z", labelX: 415, labelY: 142 },
      { id: "sun", colorId: 3, d: "M 400 55 A 35 35 0 1 0 470 55 A 35 35 0 1 0 400 55", labelX: 435, labelY: 55 },
    ],
  },
  {
    id: "train",
    title: "הרכבת הקטנה",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 330 L 0 330 Z", labelX: 55, labelY: 50 },
      { id: "ground", colorId: 4, d: "M 0 390 L 500 390 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "track", colorId: 8, d: "M 0 380 L 500 380 L 500 400 L 0 400 Z", labelX: 450, labelY: 390 },
      { id: "engine", colorId: 1, d: "M 60 240 L 220 240 L 220 370 L 60 370 Z", labelX: 140, labelY: 310 },
      { id: "cabin", colorId: 3, d: "M 130 160 L 220 160 L 220 242 L 130 242 Z", labelX: 175, labelY: 200 },
      { id: "chimney", colorId: 9, d: "M 80 175 L 110 175 L 110 242 L 80 242 Z", labelX: 95, labelY: 210 },
      { id: "smoke", colorId: 9, d: "M 62 140 Q 55 120 75 115 Q 82 98 100 105 Q 115 92 125 105 Q 138 100 135 115 Q 130 130 115 132 L 75 132 Q 55 135 62 140 Z", labelX: 98, labelY: 118 },
      { id: "window", colorId: 10, d: "M 150 180 L 200 180 L 200 225 L 150 225 Z", labelX: 175, labelY: 202 },
      { id: "wheel-f", colorId: 9, d: "M 85 345 A 25 25 0 1 0 135 345 A 25 25 0 1 0 85 345", labelX: 110, labelY: 345 },
      { id: "wheel-r", colorId: 9, d: "M 165 345 A 25 25 0 1 0 215 345 A 25 25 0 1 0 165 345", labelX: 190, labelY: 345 },
      { id: "cargo", colorId: 4, d: "M 260 270 L 420 270 L 420 370 L 260 370 Z", labelX: 340, labelY: 320 },
      { id: "cargo-whl", colorId: 9, d: "M 315 345 A 25 25 0 1 0 365 345 A 25 25 0 1 0 315 345", labelX: 340, labelY: 345 },
      { id: "cloud", colorId: 9, d: "M 300 80 Q 293 62 315 58 Q 325 42 350 52 Q 362 38 380 48 Q 395 38 398 55 Q 410 58 408 72 Q 406 85 390 88 L 315 88 Q 293 90 300 80 Z", labelX: 350, labelY: 72 },
    ],
  },
  {
    id: "apple",
    title: "התפוח המתוק",
    category: "new",
    paths: [
      { id: "bg", colorId: 5, d: "M 0 0 L 500 0 L 500 380 L 0 380 Z", labelX: 60, labelY: 50 },
      { id: "ground", colorId: 4, d: "M 0 375 Q 125 355 250 370 Q 375 385 500 365 L 500 500 L 0 500 Z", labelX: 440, labelY: 450 },
      { id: "apple", colorId: 1, d: "M 250 140 Q 155 140 140 250 Q 130 340 200 395 Q 245 425 250 425 Q 255 425 300 395 Q 370 340 360 250 Q 345 140 250 140 Z", labelX: 250, labelY: 310 },
      { id: "leaf", colorId: 4, d: "M 255 140 Q 280 100 330 95 Q 300 120 275 140 Z", labelX: 295, labelY: 112 },
      { id: "stem", colorId: 8, d: "M 244 100 L 256 100 L 256 145 L 244 145 Z", labelX: 250, labelY: 120 },
      { id: "highlight", colorId: 3, d: "M 190 200 Q 175 240 185 280 Q 200 265 200 240 Q 205 215 190 200 Z", labelX: 190, labelY: 240 },
      { id: "cheek", colorId: 7, d: "M 285 300 A 22 22 0 1 0 329 300 A 22 22 0 1 0 285 300", labelX: 307, labelY: 300 },
      { id: "worm", colorId: 4, d: "M 310 230 Q 330 218 348 232 Q 358 248 342 262 Q 332 254 338 240 Q 332 228 318 234 Z", labelX: 335, labelY: 242 },
    ],
  },
  {
    id: "balloon",
    title: "הבלון המעופף",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 460 },
      { id: "balloon", colorId: 1, d: "M 250 60 Q 155 60 140 185 Q 130 280 250 340 Q 370 280 360 185 Q 345 60 250 60 Z", labelX: 250, labelY: 180 },
      { id: "highlight", colorId: 7, d: "M 195 130 Q 185 165 192 200 Q 202 190 200 165 Q 205 142 195 130 Z", labelX: 195, labelY: 165 },
      { id: "tie", colorId: 2, d: "M 240 338 L 260 338 L 256 360 L 244 360 Z", labelX: 250, labelY: 350 },
      { id: "string", colorId: 9, d: "M 248 358 L 252 358 L 252 430 L 248 430 Z", labelX: 250, labelY: 395 },
      { id: "basket", colorId: 8, d: "M 220 428 L 280 428 L 275 480 L 225 480 Z", labelX: 250, labelY: 455 },
      { id: "rim", colorId: 2, d: "M 215 420 L 285 420 L 285 435 L 215 435 Z", labelX: 250, labelY: 428 },
      { id: "cloud-l", colorId: 9, d: "M 20 200 Q 12 182 35 178 Q 45 162 70 172 Q 82 158 100 168 Q 115 158 118 175 Q 130 178 128 192 Q 126 205 110 208 L 35 208 Q 12 210 20 200 Z", labelX: 70, labelY: 192 },
      { id: "cloud-r", colorId: 9, d: "M 380 120 Q 373 102 395 98 Q 405 82 430 92 Q 442 78 460 88 Q 475 78 478 95 Q 490 98 488 112 Q 486 125 470 128 L 395 128 Q 373 130 380 120 Z", labelX: 430, labelY: 112 },
      { id: "bird", colorId: 8, d: "M 370 280 Q 382 268 393 280 Q 404 268 415 280 Q 404 286 393 280 Q 382 286 370 280 Z", labelX: 393, labelY: 276 },
    ],
  },
  {
    id: "moon-night",
    title: "כוכב בלילה",
    category: "library",
    paths: [
      { id: "night-sky", colorId: 6, d: "M 0 0 L 500 0 L 500 380 L 0 380 Z", labelX: 440, labelY: 50 },
      { id: "hills", colorId: 4, d: "M 0 340 Q 125 280 250 320 Q 375 360 500 310 L 500 500 L 0 500 Z", labelX: 60, labelY: 450 },
      { id: "moon", colorId: 3, d: "M 360 70 A 50 50 0 1 0 360 170 A 35 35 0 1 1 360 70 Z", labelX: 385, labelY: 120 },
      { id: "star-big", colorId: 3, d: "M 150 100 L 158 122 L 180 123 L 163 138 L 168 160 L 150 148 L 132 160 L 137 138 L 120 123 L 142 122 Z", labelX: 150, labelY: 132 },
      { id: "star-1", colorId: 3, d: "M 80 200 L 85 212 L 98 213 L 88 222 L 91 235 L 80 228 L 69 235 L 72 222 L 62 213 L 75 212 Z", labelX: 80, labelY: 218 },
      { id: "star-2", colorId: 3, d: "M 250 55 L 255 67 L 268 68 L 258 77 L 261 90 L 250 83 L 239 90 L 242 77 L 232 68 L 245 67 Z", labelX: 250, labelY: 73 },
      { id: "star-3", colorId: 3, d: "M 450 220 L 455 232 L 468 233 L 458 242 L 461 255 L 450 248 L 439 255 L 442 242 L 432 233 L 445 232 Z", labelX: 450, labelY: 238 },
      { id: "house", colorId: 8, d: "M 200 330 L 280 330 L 280 400 L 200 400 Z", labelX: 240, labelY: 370 },
      { id: "roof", colorId: 1, d: "M 190 332 L 240 280 L 290 332 Z", labelX: 240, labelY: 310 },
      { id: "window-1", colorId: 3, d: "M 215 348 L 237 348 L 237 375 L 215 375 Z", labelX: 226, labelY: 362 },
      { id: "window-2", colorId: 3, d: "M 250 348 L 272 348 L 272 375 L 250 375 Z", labelX: 261, labelY: 362 },
    ],
  },
  {
    id: "rainbow",
    title: "קשת בענן",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 350 L 0 350 Z", labelX: 55, labelY: 50 },
      { id: "ground", colorId: 4, d: "M 0 345 Q 125 325 250 340 Q 375 355 500 335 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "arc-red", colorId: 1, d: "M 50 350 Q 50 120 250 120 Q 450 120 450 350 L 420 350 Q 420 150 250 150 Q 80 150 80 350 Z", labelX: 100, labelY: 200 },
      { id: "arc-orange", colorId: 2, d: "M 80 350 Q 80 155 250 155 Q 420 155 420 350 L 390 350 Q 390 185 250 185 Q 110 185 110 350 Z", labelX: 130, labelY: 235 },
      { id: "arc-yellow", colorId: 3, d: "M 110 350 Q 110 185 250 185 Q 390 185 390 350 L 360 350 Q 360 215 250 215 Q 140 215 140 350 Z", labelX: 160, labelY: 265 },
      { id: "arc-green", colorId: 4, d: "M 140 350 Q 140 215 250 215 Q 360 215 360 350 L 330 350 Q 330 245 250 245 Q 170 245 170 350 Z", labelX: 190, labelY: 290 },
      { id: "arc-blue", colorId: 10, d: "M 170 350 Q 170 245 250 245 Q 330 245 330 350 L 300 350 Q 300 275 250 275 Q 200 275 200 350 Z", labelX: 220, labelY: 310 },
      { id: "cloud-l", colorId: 9, d: "M 20 310 Q 12 290 35 286 Q 45 270 70 280 Q 82 266 100 276 Q 115 266 118 283 Q 130 286 128 300 Q 126 315 110 318 L 35 318 Q 12 320 20 310 Z", labelX: 70, labelY: 298 },
      { id: "cloud-r", colorId: 9, d: "M 380 310 Q 373 292 395 288 Q 405 272 430 282 Q 442 268 460 278 Q 475 268 478 285 Q 490 288 488 302 Q 486 315 470 318 L 395 318 Q 373 320 380 310 Z", labelX: 430, labelY: 298 },
      { id: "sun", colorId: 3, d: "M 388 55 A 38 38 0 1 0 464 55 A 38 38 0 1 0 388 55", labelX: 426, labelY: 55 },
    ],
  },
  {
    id: "ice-cream",
    title: "הגלידה המתוקה",
    category: "new",
    paths: [
      { id: "bg", colorId: 5, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 460 },
      { id: "cone", colorId: 8, d: "M 185 275 L 315 275 L 250 480 Z", labelX: 250, labelY: 385 },
      { id: "cone-line", colorId: 2, d: "M 200 290 L 290 290 L 285 305 L 205 305 Z", labelX: 245, labelY: 298 },
      { id: "scoop-bot", colorId: 7, d: "M 170 210 Q 170 145 250 145 Q 330 145 330 210 Q 330 280 250 280 Q 170 280 170 210 Z", labelX: 250, labelY: 225 },
      { id: "scoop-mid", colorId: 3, d: "M 190 148 Q 190 88 250 88 Q 310 88 310 148 Q 310 198 250 198 Q 190 198 190 148 Z", labelX: 250, labelY: 142 },
      { id: "scoop-top", colorId: 1, d: "M 208 92 Q 208 42 250 42 Q 292 42 292 92 Q 292 135 250 135 Q 208 135 208 92 Z", labelX: 250, labelY: 85 },
      { id: "cherry", colorId: 1, d: "M 236 40 A 14 14 0 1 0 264 40 A 14 14 0 1 0 236 40", labelX: 250, labelY: 40 },
      { id: "cherry-stem", colorId: 4, d: "M 248 27 Q 262 8 275 15 Q 268 22 256 27 Z", labelX: 263, labelY: 18 },
      { id: "drip", colorId: 7, d: "M 310 220 Q 325 230 320 255 Q 315 270 305 265 Q 312 250 308 235 Z", labelX: 315, labelY: 245 },
    ],
  },
  {
    id: "candle",
    title: "הנר הדולק",
    category: "library",
    paths: [
      { id: "bg", colorId: 6, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 60 },
      { id: "body", colorId: 1, d: "M 210 200 L 290 200 L 290 420 L 210 420 Z", labelX: 250, labelY: 320 },
      { id: "stripe1", colorId: 3, d: "M 210 280 L 290 280 L 290 310 L 210 310 Z", labelX: 250, labelY: 295 },
      { id: "stripe2", colorId: 3, d: "M 210 350 L 290 350 L 290 380 L 210 380 Z", labelX: 250, labelY: 365 },
      { id: "wick", colorId: 9, d: "M 247 145 L 253 145 L 253 202 L 247 202 Z", labelX: 250, labelY: 175 },
      { id: "flame-outer", colorId: 2, d: "M 250 55 Q 222 95 225 130 Q 235 150 250 150 Q 265 150 275 130 Q 278 95 250 55 Z", labelX: 260, labelY: 105 },
      { id: "flame-inner", colorId: 3, d: "M 250 85 Q 238 108 240 128 Q 245 142 250 142 Q 255 142 260 128 Q 262 108 250 85 Z", labelX: 250, labelY: 118 },
      { id: "holder", colorId: 8, d: "M 185 418 L 315 418 L 325 460 L 175 460 Z", labelX: 250, labelY: 440 },
      { id: "holder-base", colorId: 8, d: "M 165 458 L 335 458 L 335 485 L 165 485 Z", labelX: 250, labelY: 472 },
      { id: "sparkle-l", colorId: 3, d: "M 120 100 L 125 112 L 138 113 L 128 122 L 131 135 L 120 128 L 109 135 L 112 122 L 102 113 L 115 112 Z", labelX: 120, labelY: 118 },
    ],
  },
  {
    id: "cat",
    title: "החתול הסקרן",
    category: "new",
    paths: [
      { id: "bg", colorId: 5, d: "M 0 0 L 500 0 L 500 400 L 0 400 Z", labelX: 60, labelY: 50 },
      { id: "ground", colorId: 4, d: "M 0 395 L 500 395 L 500 500 L 0 500 Z", labelX: 60, labelY: 450 },
      { id: "body", colorId: 2, d: "M 180 230 Q 170 310 190 400 L 310 400 Q 330 310 320 230 Q 310 180 250 175 Q 190 180 180 230 Z", labelX: 250, labelY: 330 },
      { id: "head", colorId: 2, d: "M 200 160 Q 200 100 250 100 Q 300 100 300 160 Q 300 200 250 210 Q 200 200 200 160 Z", labelX: 250, labelY: 155 },
      { id: "ear-l", colorId: 7, d: "M 205 115 L 185 60 L 225 100 Z", labelX: 200, labelY: 85 },
      { id: "ear-r", colorId: 7, d: "M 295 115 L 315 60 L 275 100 Z", labelX: 300, labelY: 85 },
      { id: "eye-l", colorId: 4, d: "M 218 135 A 14 14 0 1 0 246 135 A 14 14 0 1 0 218 135", labelX: 232, labelY: 135 },
      { id: "eye-r", colorId: 4, d: "M 254 135 A 14 14 0 1 0 282 135 A 14 14 0 1 0 254 135", labelX: 268, labelY: 135 },
      { id: "nose", colorId: 7, d: "M 240 165 L 250 175 L 260 165 Z", labelX: 250, labelY: 168 },
      { id: "tail", colorId: 2, d: "M 315 300 Q 380 280 400 220 Q 420 170 390 140 Q 400 140 425 170 Q 445 220 400 290 Q 370 320 320 310 Z", labelX: 400, labelY: 220 },
      { id: "paw-l", colorId: 9, d: "M 195 388 L 215 388 L 215 410 Q 205 418 195 410 Z", labelX: 205, labelY: 400 },
      { id: "paw-r", colorId: 9, d: "M 285 388 L 305 388 L 305 410 Q 295 418 285 410 Z", labelX: 295, labelY: 400 },
    ],
  },
  {
    id: "flower",
    title: "הפרח היפה",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 350 L 0 350 Z", labelX: 55, labelY: 45 },
      { id: "ground", colorId: 4, d: "M 0 345 Q 125 325 250 340 Q 375 355 500 335 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "stem", colorId: 4, d: "M 245 250 L 255 250 L 255 430 L 245 430 Z", labelX: 250, labelY: 350 },
      { id: "leaf-l", colorId: 4, d: "M 245 320 Q 190 300 180 330 Q 185 360 245 340 Z", labelX: 210, labelY: 330 },
      { id: "leaf-r", colorId: 4, d: "M 255 350 Q 310 330 320 360 Q 315 390 255 370 Z", labelX: 290, labelY: 360 },
      { id: "petal-t", colorId: 7, d: "M 250 80 Q 210 100 210 145 Q 210 175 250 185 Q 290 175 290 145 Q 290 100 250 80 Z", labelX: 250, labelY: 130 },
      { id: "petal-l", colorId: 1, d: "M 185 150 Q 160 185 175 225 Q 195 250 220 235 Q 205 210 210 190 Q 208 168 185 150 Z", labelX: 192, labelY: 195 },
      { id: "petal-r", colorId: 1, d: "M 315 150 Q 340 185 325 225 Q 305 250 280 235 Q 295 210 290 190 Q 292 168 315 150 Z", labelX: 308, labelY: 195 },
      { id: "petal-bl", colorId: 7, d: "M 210 228 Q 190 258 210 280 Q 232 292 250 270 Q 238 252 222 240 Z", labelX: 222, labelY: 260 },
      { id: "petal-br", colorId: 7, d: "M 290 228 Q 310 258 290 280 Q 268 292 250 270 Q 262 252 278 240 Z", labelX: 278, labelY: 260 },
      { id: "center", colorId: 3, d: "M 222 195 A 28 28 0 1 0 278 195 A 28 28 0 1 0 222 195", labelX: 250, labelY: 195 },
      { id: "sun", colorId: 3, d: "M 55 55 A 40 40 0 1 0 135 55 A 40 40 0 1 0 55 55", labelX: 95, labelY: 55 },
    ],
  },
  {
    id: "car",
    title: "המכונית האדומה",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 300 L 0 300 Z", labelX: 55, labelY: 50 },
      { id: "grass", colorId: 4, d: "M 0 370 L 500 370 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "road", colorId: 9, d: "M 0 298 L 500 298 L 500 375 L 0 375 Z", labelX: 450, labelY: 340 },
      { id: "road-line", colorId: 3, d: "M 0 332 L 500 332 L 500 340 L 0 340 Z", labelX: 55, labelY: 336 },
      { id: "car-body", colorId: 1, d: "M 100 250 L 400 250 L 410 310 Q 410 350 400 350 L 100 350 Q 90 350 90 310 Z", labelX: 250, labelY: 305 },
      { id: "car-top", colorId: 1, d: "M 160 175 L 340 175 Q 350 175 355 250 L 145 250 Q 150 175 160 175 Z", labelX: 250, labelY: 215 },
      { id: "window-f", colorId: 10, d: "M 255 190 L 335 190 L 340 240 L 255 240 Z", labelX: 298, labelY: 215 },
      { id: "window-b", colorId: 10, d: "M 165 190 L 245 190 L 245 240 L 165 240 Z", labelX: 205, labelY: 215 },
      { id: "wheel-f", colorId: 9, d: "M 300 328 A 30 30 0 1 0 360 328 A 30 30 0 1 0 300 328", labelX: 330, labelY: 328 },
      { id: "wheel-r", colorId: 9, d: "M 130 328 A 30 30 0 1 0 190 328 A 30 30 0 1 0 130 328", labelX: 160, labelY: 328 },
      { id: "headlight", colorId: 3, d: "M 395 270 L 415 270 L 415 295 L 395 295 Z", labelX: 405, labelY: 283 },
      { id: "cloud", colorId: 9, d: "M 280 60 Q 273 42 295 38 Q 305 22 330 32 Q 342 18 360 28 Q 375 18 378 35 Q 390 38 388 52 Q 386 65 370 68 L 295 68 Q 273 70 280 60 Z", labelX: 330, labelY: 50 },
    ],
  },
  {
    id: "snowman",
    title: "איש השלג",
    category: "library",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 350 L 0 350 Z", labelX: 55, labelY: 50 },
      { id: "snow", colorId: 9, d: "M 0 345 L 500 345 L 500 500 L 0 500 Z", labelX: 55, labelY: 460 },
      { id: "body-bot", colorId: 9, d: "M 170 320 A 80 80 0 1 0 330 320 A 80 80 0 1 0 170 320", labelX: 250, labelY: 300 },
      { id: "body-mid", colorId: 9, d: "M 195 225 A 55 55 0 1 0 305 225 A 55 55 0 1 0 195 225", labelX: 250, labelY: 215 },
      { id: "head", colorId: 9, d: "M 210 145 A 40 40 0 1 0 290 145 A 40 40 0 1 0 210 145", labelX: 250, labelY: 140 },
      { id: "hat-brim", colorId: 6, d: "M 195 108 L 305 108 L 305 122 L 195 122 Z", labelX: 250, labelY: 115 },
      { id: "hat-top", colorId: 6, d: "M 215 48 L 285 48 L 285 110 L 215 110 Z", labelX: 250, labelY: 78 },
      { id: "scarf", colorId: 1, d: "M 195 168 L 305 168 L 305 192 L 195 192 Z", labelX: 250, labelY: 180 },
      { id: "scarf-end", colorId: 1, d: "M 298 185 L 322 185 L 322 232 L 298 232 Z", labelX: 310, labelY: 210 },
      { id: "nose", colorId: 2, d: "M 250 142 L 298 152 L 250 160 Z", labelX: 272, labelY: 150 },
      { id: "eye-l", colorId: 8, d: "M 225 126 A 7 7 0 1 0 239 126 A 7 7 0 1 0 225 126", labelX: 232, labelY: 126 },
      { id: "eye-r", colorId: 8, d: "M 258 126 A 7 7 0 1 0 272 126 A 7 7 0 1 0 258 126", labelX: 265, labelY: 126 },
      { id: "button1", colorId: 8, d: "M 243 205 A 7 7 0 1 0 257 205 A 7 7 0 1 0 243 205", labelX: 250, labelY: 205 },
      { id: "button2", colorId: 8, d: "M 243 235 A 7 7 0 1 0 257 235 A 7 7 0 1 0 243 235", labelX: 250, labelY: 235 },
    ],
  },
  {
    id: "mushroom",
    title: "הפטריה הקסומה",
    category: "new",
    paths: [
      { id: "sky", colorId: 5, d: "M 0 0 L 500 0 L 500 350 L 0 350 Z", labelX: 55, labelY: 50 },
      { id: "ground", colorId: 4, d: "M 0 345 Q 125 325 250 340 Q 375 355 500 335 L 500 500 L 0 500 Z", labelX: 55, labelY: 450 },
      { id: "cap", colorId: 1, d: "M 100 250 Q 100 100 250 100 Q 400 100 400 250 L 100 250 Z", labelX: 250, labelY: 180 },
      { id: "cap-under", colorId: 7, d: "M 115 248 L 385 248 L 385 275 L 115 275 Z", labelX: 250, labelY: 262 },
      { id: "stem", colorId: 3, d: "M 200 273 L 300 273 L 310 420 L 190 420 Z", labelX: 250, labelY: 350 },
      { id: "dot1", colorId: 3, d: "M 170 168 A 22 22 0 1 0 214 168 A 22 22 0 1 0 170 168", labelX: 192, labelY: 168 },
      { id: "dot2", colorId: 3, d: "M 236 132 A 18 18 0 1 0 272 132 A 18 18 0 1 0 236 132", labelX: 254, labelY: 132 },
      { id: "dot3", colorId: 3, d: "M 300 172 A 20 20 0 1 0 340 172 A 20 20 0 1 0 300 172", labelX: 320, labelY: 172 },
      { id: "grass-l", colorId: 4, d: "M 130 410 Q 140 370 150 410 Q 160 360 170 410 Z", labelX: 150, labelY: 390 },
      { id: "grass-r", colorId: 4, d: "M 340 410 Q 350 370 360 410 Q 370 360 380 410 Z", labelX: 360, labelY: 390 },
      { id: "snail", colorId: 2, d: "M 390 408 Q 390 383 412 383 Q 434 383 434 408 Q 434 428 412 428 Q 396 428 396 415 Q 396 402 408 402 Q 418 402 418 415 Z", labelX: 412, labelY: 408 },
      { id: "sun", colorId: 3, d: "M 55 55 A 38 38 0 1 0 131 55 A 38 38 0 1 0 55 55", labelX: 93, labelY: 55 },
    ],
  },
  {
    id: "crown",
    title: "הכתר המלכותי",
    category: "library",
    paths: [
      { id: "bg", colorId: 6, d: "M 0 0 L 500 0 L 500 500 L 0 500 Z", labelX: 60, labelY: 460 },
      { id: "cushion", colorId: 7, d: "M 100 360 Q 100 330 250 330 Q 400 330 400 360 Q 400 420 250 420 Q 100 420 100 360 Z", labelX: 250, labelY: 375 },
      { id: "tassel", colorId: 2, d: "M 230 415 L 250 450 L 270 415 Z", labelX: 250, labelY: 435 },
      { id: "base", colorId: 3, d: "M 120 250 L 380 250 L 380 340 L 120 340 Z", labelX: 250, labelY: 300 },
      { id: "band", colorId: 3, d: "M 120 315 L 380 315 L 380 345 L 120 345 Z", labelX: 250, labelY: 330 },
      { id: "point-l", colorId: 3, d: "M 120 252 L 170 140 L 220 252 Z", labelX: 170, labelY: 205 },
      { id: "point-c", colorId: 3, d: "M 200 252 L 250 120 L 300 252 Z", labelX: 250, labelY: 195 },
      { id: "point-r", colorId: 3, d: "M 280 252 L 330 140 L 380 252 Z", labelX: 330, labelY: 205 },
      { id: "jewel-l", colorId: 1, d: "M 153 268 A 15 15 0 1 0 183 268 A 15 15 0 1 0 153 268", labelX: 168, labelY: 268 },
      { id: "jewel-c", colorId: 5, d: "M 233 268 A 17 17 0 1 0 267 268 A 17 17 0 1 0 233 268", labelX: 250, labelY: 268 },
      { id: "jewel-r", colorId: 4, d: "M 317 268 A 15 15 0 1 0 347 268 A 15 15 0 1 0 317 268", labelX: 332, labelY: 268 },
      { id: "star-top", colorId: 3, d: "M 250 92 L 256 108 L 272 109 L 259 120 L 263 136 L 250 127 L 237 136 L 241 120 L 228 109 L 244 108 Z", labelX: 250, labelY: 115 },
    ],
  },
];
