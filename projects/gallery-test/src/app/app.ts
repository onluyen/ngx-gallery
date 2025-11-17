import { Component, signal } from "@angular/core";
import { NgxGalleryComponent, NgxGalleryOptions } from "onluyen-gallery";

@Component({
  selector: "app-root",
  imports: [NgxGalleryComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("gallery-test");

  galleryOptions: NgxGalleryOptions[] = [
    {
      width: "100%",
      height: "400px",
      imageAnimation: "rotate",
      imageSize: "contain",
      thumbnails: true,
      thumbnailsRows: 1,
      thumbnailsColumns: 6,
      thumbnailsPercent: 18,
      thumbnailMargin: 8,
      thumbnailSize: "contain",
      previewZoom: true,
      previewRotate: true,
      previewInfinityMove: true,
    },
    {
      breakpoint: 600,
      width: "100%",
      height: "250px",
      imageSize: "contain",
      thumbnailsColumns: 4,
      thumbnailsPercent: 28,
      thumbnailSize: "contain",
      thumbnailMargin: 6,
    },
  ];

  galleryImages: string[] = [
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",

    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
    "https://diy67u2u0u3eb.cloudfront.net/answer/20251115/6917fbd6383e3d427e53ec27.png",
  ];
}
