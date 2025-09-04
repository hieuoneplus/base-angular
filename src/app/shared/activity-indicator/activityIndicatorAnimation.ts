import {
  animate,
  animateChild,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
  keyframes
} from '@angular/animations';

export const activityIndicatorAnimation = trigger('activityIndicatorAnimation', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate('100ms ease',
      style({
        opacity: 1
      })),
  ]),
  transition(':leave', [
    query('.path', [
      style({
        'animation-play-state': 'paused',
      }),
      animate('0.6s ease', keyframes([
        style({
          'stroke-dasharray': '89, 100',
          'stroke-dashoffset': '-124px',
          offset: 0.5
        }),
        style({
          'stroke-dasharray': '200,0',
          'stroke-dashoffset': '-145px',
          offset: 1
        })
      ]))
    ], { optional: true }),
    style({
      opacity: 1
    }),
    animate('150ms ease',
      style({
        opacity: 0
      }))
  ])
]);
