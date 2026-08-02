import Svg, { G, Rect } from "react-native-svg";
import { colors } from "@/lib/theme";

export function QrCode({ size = 168 }: { size?: number }) {
  const n = 21;
  const cells: boolean[][] = [];
  let seed = 190101044;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let y = 0; y < n; y++) {
    cells.push(Array.from({ length: n }, () => rand() > 0.5));
  }
  const isFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);

  const finderPositions: Array<[number, number]> = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${n} ${n}`}>
      <Rect width={n} height={n} fill={colors.white} />
      {cells.map((row, y) =>
        row.map((on, x) =>
          on && !isFinder(x, y) ? (
            <Rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={colors.clinical}
            />
          ) : null,
        ),
      )}
      {finderPositions.map(([x, y]) => (
        <G key={`f${x}-${y}`}>
          <Rect x={x} y={y} width={7} height={7} fill={colors.kou} />
          <Rect x={x + 1} y={y + 1} width={5} height={5} fill={colors.white} />
          <Rect x={x + 2} y={y + 2} width={3} height={3} fill={colors.kou} />
        </G>
      ))}
    </Svg>
  );
}
