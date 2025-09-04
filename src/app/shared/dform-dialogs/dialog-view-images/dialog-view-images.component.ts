import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-images',
  templateUrl: './dialog-view-images.component.html',
  styleUrls: ['./dialog-view-images.component.scss']
})
export class DialogViewImagesComponent {
  listImage: any[] = [];
  isShowImage = true;
  activeItem = 0;
  activeImage: any;
  angle = 0;
  isSingle = true;
  constructor(
    public dialogRef: MatDialogRef<DialogViewImagesComponent>,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
    this.listImage = this.data && this.data.data && this.data.data.length > 0 ? this.data.data : [];
    if (!this.listImage || (this.listImage && this.listImage.length == 0)) {
      this.isShowImage = false;
    } else {
      this.isShowImage = true;
      this.activeImage = this.listImage[this.activeItem];
      if (this.listImage.length > 1) {
        this.isSingle = false;
      }
    }
  }

  onActiveItem(index: any) {
    this.activeItem = index;
    this.activeImage = this.listImage[this.activeItem];
    const elementView = document.querySelector('.main-image');
    if (elementView) {
      this.angle = 0;
      this.renderer.setStyle(
        elementView,
        'max-width',
        '588px'
      );
      this.renderer.setStyle(
        elementView,
        'max-height',
        '428px'
      );
      this.renderer.setStyle(
        elementView,
        'width',
        'auto'
      );
      this.renderer.setStyle(
        elementView,
        'transform',
        'rotate(' + this.angle + 'deg)'
      );
    }
  }

  onCloseCancel() {
    this.dialogRef.close();
  }

  prevActiveImage() {
    this.activeItem = (this.activeItem - 1) < 0 ? this.listImage.length - 1 : this.activeItem - 1;
    this.onActiveItem(this.activeItem);
    const element = document.querySelector('.image-' + this.activeItem);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  nextActiveImage() {
    this.activeItem = (this.activeItem + 1) > this.listImage.length - 1 ? 0 : this.activeItem + 1;
    this.onActiveItem(this.activeItem);
    const element = document.querySelector('.image-' + this.activeItem);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onRotateLeft() {
    const element = document.querySelector('.main-image');
    if (element) {
      this.renderer.setStyle(
        element,
        'width',
        'auto'
      );
      this.angle -= 90;
      this.renderer.setStyle(
        element,
        'transform',
        'rotate(' + this.angle + 'deg)'
      );
    }
  }

  onRotateRight() {
    const element = document.querySelector('.main-image');
    if (element) {
      this.renderer.setStyle(
        element,
        'width',
        'auto'
      );
      this.angle += 90;
      this.renderer.setStyle(
        element,
        'transform',
        'rotate(' + this.angle + 'deg)'
      );
    }
  }

  onZoomIn() {
    const element = document.querySelector('.main-image');
    if (element) {
      const width = element.clientWidth;
      this.renderer.setStyle(
        element,
        'max-width',
        (width + 50) + 'px'
      );
      this.renderer.setStyle(
        element,
        'max-height',
        'unset'
      );
      this.renderer.setStyle(
        element,
        'width',
        (width + 50) + 'px'
      );
    }
  }

  onZoomOut() {
    const element = document.querySelector('.main-image');
    if (element) {
      const width = element.clientWidth;
      this.renderer.setStyle(
        element,
        'max-width',
        (width + 50) + 'px'
      );
      this.renderer.setStyle(
        element,
        'max-height',
        'unset'
      );
      this.renderer.setStyle(
        element,
        'width',
        (width - 50) + 'px'
      );
    }
  }

  viewFullScreen() {
    const image = new Image();
    image.src = this.activeImage;
    const attr = document?.querySelector('.main-image')?.getAttribute('src');
    if (this.isSingle && image && attr) {
      image.src = attr;
    }
    const w = window.open('');
    if (w){
      w.document.write(image.outerHTML);
      w.document.close();
    }
  }

  gradToScroll() {
    const slider = document.querySelector('.image-current');
    let isDown = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;
    if (slider) {
      slider.addEventListener('mousedown', (e: any) => {
        isDown = true;
        startX = e.pageX - slider.scrollLeft;
        scrollLeft = slider.scrollLeft;
        startY = e.pageY - slider.scrollTop;
        scrollTop = slider.scrollTop;
      });
      slider.addEventListener('mouseleave', () => {
        isDown = false;
      });
      slider.addEventListener('mouseup', () => {
        isDown = false;
      });
      slider.addEventListener('mousemove', (e: any) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.scrollLeft;
        const y = e.pageY - slider.scrollTop;
        const walkLeft = (x - startX) / 2;
        slider.scrollLeft = scrollLeft - walkLeft;
        const walkTop = (y - startY) / 2;
        slider.scrollTop = scrollTop - walkTop;
      });
    }
  }

  onResizeImage() {
    const element = document.querySelector('.main-image');
    if (element) {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width > 0 && height > 0) {
        const top = (428 - height) > 0 ? (428 - height) / 2 : 0;
        const left = ((this.isSingle ? 734 : 588) - width) > 0 ? ((this.isSingle ? 734 : 588) - width) / 2 : 0;
        this.renderer.setStyle(
          element,
          'top',
          top + 'px'
        );
        this.renderer.setStyle(
          element,
          'left',
          left + 'px'
        );
      }
    }
  }
}
