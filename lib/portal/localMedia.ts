/**
 * tip.kocaeli.edu.tr'den indirilen yerel afiş/görseller.
 * Metro static require — imageUrl / id ile çözülür.
 */
import type { ImageSourcePropType } from "react-native";

const BY_ID: Record<string, ImageSourcePropType> = {
  "ev-live-1": require("../../assets/campus/etkinlikler/ev-1.jpg"),
  "ev-live-2": require("../../assets/campus/etkinlikler/ev-2.jpg"),
  "ev-live-3": require("../../assets/campus/etkinlikler/ev-3.jpg"),
  "ev-live-4": require("../../assets/campus/etkinlikler/ev-4.jpg"),
  "ev-live-5": require("../../assets/campus/etkinlikler/ev-5.jpg"),
  "ev-live-6": require("../../assets/campus/etkinlikler/ev-6.jpg"),
  "ev-live-7": require("../../assets/campus/etkinlikler/ev-7.jpg"),
  "ev-live-8": require("../../assets/campus/etkinlikler/ev-8.jpg"),
  "pa-live-7": require("../../assets/campus/duyurular/pa-7.jpg"),
};

const BY_PATH: Record<string, ImageSourcePropType> = {
  "/assets/campus/etkinlikler/ev-1.jpg": BY_ID["ev-live-1"],
  "/assets/campus/etkinlikler/ev-2.jpg": BY_ID["ev-live-2"],
  "/assets/campus/etkinlikler/ev-3.jpg": BY_ID["ev-live-3"],
  "/assets/campus/etkinlikler/ev-3.png": BY_ID["ev-live-3"],
  "/assets/campus/etkinlikler/ev-4.jpg": BY_ID["ev-live-4"],
  "/assets/campus/etkinlikler/ev-5.jpg": BY_ID["ev-live-5"],
  "/assets/campus/etkinlikler/ev-6.jpg": BY_ID["ev-live-6"],
  "/assets/campus/etkinlikler/ev-7.jpg": BY_ID["ev-live-7"],
  "/assets/campus/etkinlikler/ev-8.jpg": BY_ID["ev-live-8"],
  "/assets/campus/duyurular/pa-7.jpg": BY_ID["pa-live-7"],
  "assets/campus/etkinlikler/ev-1.jpg": BY_ID["ev-live-1"],
  "assets/campus/etkinlikler/ev-2.jpg": BY_ID["ev-live-2"],
  "assets/campus/etkinlikler/ev-3.jpg": BY_ID["ev-live-3"],
  "assets/campus/etkinlikler/ev-3.png": BY_ID["ev-live-3"],
  "assets/campus/etkinlikler/ev-4.jpg": BY_ID["ev-live-4"],
  "assets/campus/etkinlikler/ev-5.jpg": BY_ID["ev-live-5"],
  "assets/campus/etkinlikler/ev-6.jpg": BY_ID["ev-live-6"],
  "assets/campus/etkinlikler/ev-7.jpg": BY_ID["ev-live-7"],
  "assets/campus/etkinlikler/ev-8.jpg": BY_ID["ev-live-8"],
  "assets/campus/duyurular/pa-7.jpg": BY_ID["pa-live-7"],
};

export function resolvePortalImage(
  id?: string | null,
  imageUrl?: string | null,
): ImageSourcePropType | null {
  if (id && BY_ID[id]) return BY_ID[id];
  if (imageUrl) {
    if (BY_PATH[imageUrl]) return BY_PATH[imageUrl];
    // seed bazen .png bırakmış olabilir
    const swapped = imageUrl.replace(/\.png$/i, ".jpg");
    if (BY_PATH[swapped]) return BY_PATH[swapped];
  }
  return null;
}
