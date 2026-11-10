import React from "react";
import { View } from "react-native";

// Ilustrasi dari View dasar agar tetap berjalan di APK yang sudah terpasang.
function Line({ from, to, color, scale }) {
  const dx = (to[0] - from[0]) * scale;
  const dy = (to[1] - from[1]) * scale;
  const length = Math.hypot(dx, dy);
  const weight = Math.max(1, 2 * scale);
  return (
    <View
      style={{
        position: "absolute",
        left: ((from[0] + to[0]) / 2) * scale - length / 2,
        top: ((from[1] + to[1]) / 2) * scale - weight / 2,
        width: length,
        height: weight,
        borderRadius: weight,
        backgroundColor: color,
        transform: [{ rotate: `${(Math.atan2(dy, dx) * 180) / Math.PI}deg` }],
      }}
    />
  );
}

export function GraduationCap({ size = 220, color = "#dceadf" }) {
  const scale = size / 220;
  const segments = [
    [
      [19, 63],
      [110, 19],
    ],
    [
      [110, 19],
      [201, 63],
    ],
    [
      [201, 63],
      [110, 107],
    ],
    [
      [110, 107],
      [19, 63],
    ],
    [
      [201, 64],
      [201, 140],
    ],
  ];
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: 170 * scale }}
    >
      {segments.map(([from, to], index) => (
        <Line key={index} from={from} to={to} color={color} scale={scale} />
      ))}
      <View
        style={{
          position: "absolute",
          left: 50 * scale,
          top: 79 * scale,
          width: 120 * scale,
          height: 65 * scale,
          borderColor: color,
          borderWidth: Math.max(1, 2 * scale),
          borderTopWidth: 0,
          borderBottomLeftRadius: 70 * scale,
          borderBottomRightRadius: 70 * scale,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 196 * scale,
          top: 141 * scale,
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 5 * scale,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function CampusIcon({ size = 28, color = "#18312d" }) {
  const scale = size / 24;
  const segments = [
    [
      [4, 20],
      [20, 20],
    ],
    [
      [6, 20],
      [6, 8],
    ],
    [
      [6, 8],
      [12, 4],
    ],
    [
      [12, 4],
      [18, 8],
    ],
    [
      [18, 8],
      [18, 20],
    ],
  ];
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size }}
    >
      {segments.map(([from, to], index) => (
        <Line key={index} from={from} to={to} color={color} scale={scale} />
      ))}
      {[
        [9, 11],
        [15, 11],
        [9, 15],
        [15, 15],
      ].map(([x, y]) => (
        <View
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: (x - 1) * scale,
            top: (y - 1) * scale,
            width: 2 * scale,
            height: 2 * scale,
            borderRadius: scale,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}
