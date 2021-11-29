import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

const fadeIn = [

    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
      
    ], { optional: true }),
    query(':enter', [
      style({ transform : 'scale(0)' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [
        animate('500ms ease-out', style({ transform : 'scale(0)' }))
      ], { optional: true }),
      query(':enter', [
        animate('500ms ease-out', style({ transform: 'scale(1)' }))
      ], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true }),
]

export const slideInAnimation =
  trigger('routeAnimations', [


    transition('DashboardPage => HomePage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' })
      ], { optional: true }),
      query(':leave',  animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),

    transition('HomePage => DashboardPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform : 'translateX(100%)' })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ transform : 'translateX(-100%)' }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ transform : 'translateX(0%)' }))
          ], { optional: true })
        ]),
        query(':enter', animateChild(), { optional: true }),
      ]),

    transition('* => DetailPage', fadeIn),

    transition('* <=> *', fadeIn),

  ]);
