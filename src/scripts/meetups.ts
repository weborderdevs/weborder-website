import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';

var customParseFormat = require('dayjs/plugin/customParseFormat');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('es-mx');

interface MeetupInterface {
   date: string;
   log: string;
   author: string;
   url: string;
   body: string;
   isVirtual: boolean;
   image: string;
}

type MeetupKey = keyof MeetupInterface;

class Meetups {
   isMeetupsPage: boolean;

   constructor() {
      this.isMeetupsPage = true;

      window.addEventListener('load', () => {
         this.onPageLoad();
      });
   }

   onPageLoad() {
      if (this.isMeetupsPage) {
         fetch('../assets/data/meetups.json')
            .then((response) => response.json())
            .then((meetups: MeetupInterface[]) => {
               let sortedMeetups: MeetupInterface[] = [...meetups];
               sortedMeetups.reverse();

               this.loadNextMeetup(sortedMeetups[0]);

               let lastMeetups = sortedMeetups.slice(1, sortedMeetups.length);
               lastMeetups.forEach((mt: MeetupInterface) => {
                  var str = '<pre><code>{<br>';
                  Object.keys(mt).forEach((key) => {
                     if (key) {
                        const isDateKey = key === 'date';
                        const isImageKey = key === 'image';
                        const isVirtualKey = key === 'isVirtual';
                        const isUrlKey = key === 'url';
                        const currentKeyValue = mt[
                           key as MeetupKey
                        ] as typeof key;
                        const isUrlEmpty = currentKeyValue === '';

                        if (
                           !(
                              isImageKey ||
                              isVirtualKey ||
                              isUrlKey ||
                              isDateKey
                           )
                        ) {
                           str += `<span>${key}:</span> "${currentKeyValue}",<br>`;
                        }

                        if (isUrlKey && !isUrlEmpty) {
                           str += `<span>${key}:</span> "<a target="_blank" href="${currentKeyValue}">${currentKeyValue}</a>",<br>`;
                        }

                        if (isDateKey) {
                           const dateFormat = dayjs(
                              currentKeyValue,
                              'DD-MM-YYYY'
                           )
                              .format('LL')
                              .toString();
                           str += `<span>${key}:</span> ${dateFormat},<br>`;
                        }
                     }
                  });
                  str += '}</code></pre>';
                  document
                     .getElementById('list')
                     ?.insertAdjacentHTML('beforeend', str);
               });
            });
      }
   }

   loadNextMeetup(meetup: MeetupInterface) {
      const nextMeetupTitle = document.getElementById('next-meetup-body');
      const nextMeetupAuthor = document.getElementById('next-meetup-author');
      const nextMeetupDate = document.getElementById('next-meetup-date');
      const nextMeetupImage: HTMLImageElement | null = document.getElementById(
         'next-meetup-image'
      ) as HTMLImageElement;

      if (nextMeetupTitle) {
         nextMeetupTitle.innerHTML = meetup.log;
      }

      if (nextMeetupAuthor) {
         nextMeetupAuthor.innerText = meetup.author;
      }

      if (nextMeetupDate) {
         nextMeetupDate.innerText = dayjs(meetup.date, 'DD-MM-YYYY')
            .format('LL')
            .toString();
      }

      if (nextMeetupImage && meetup.image) {
         nextMeetupImage.src = `../assets/images/meetups/hosts/${meetup.image}`;
      } else {
         nextMeetupImage.src = `../assets/images/home/home-cover-robot.png`;
      }

      // Hide next meetup sign if today is greater than
      // meetup date
      let currentDate = new Date();
      let dateString =
         String(currentDate.getDate()).padStart(2, '0') +
         '-' +
         (1 + currentDate.getMonth()) +
         '-' +
         currentDate.getFullYear();
      let meetupDate = dayjs(meetup.date, 'DD-MM-YYYY');
      let todayDate = dayjs(dateString, 'DD-MM-YYYY');

      if (todayDate.isAfter(meetupDate)) {
         document.getElementById('next-meetup-sign')!.classList.add('hide');
      }
   }

   isPageMeetupsPage(): boolean {
      const currentURL = window.location.pathname;
      return (
         Boolean(currentURL.includes('meetups')) ||
         Boolean(currentURL.includes('index.html'))
      );
   }
}

new Meetups();
