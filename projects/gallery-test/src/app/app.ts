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
      imageAnimation: "rotate",
      previewZoom: true,
      previewRotate: true,
      previewInfinityMove: true,
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
