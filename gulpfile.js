const gulp = require('gulp'); 
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create(); 

// Мы создали функцию с именем html и экспортировали её для вызова из терминала. 
function html() {
  return gulp.src('src/**/*.html')
}

exports.html = html 

//Во встроенном в Gulp методе src(), который умеет искать файлы, 
// мы указали путь до всех файлов с расширением HTML внутри папки src/. 
// Теперь применим к ним пайп (шаг) с методом Gulp dest(). 
// Этот метод отвечает за отправку файла в точку назначения (папку dist/).
function html() {
  return gulp.src('src/**/*.html')
        .pipe(plumber())
                .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
} 

exports.html = html; 

//Склеивание и сборка CSS
// В этой задаче нам нужно будет не просто скопировать файлы, но и склеить много файлов в один. Такой процесс называют созданием бандла, а итоговый CSS-файл в папке dist/ — бандлом.
// Предположим, мы работаем в команде, где практикуют компонентный подход и CSS хранят в отдельных файлах в структуре nested-БЭМ. Примерно так это может выглядеть:

function css() {
  return gulp.src('src/blocks/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
                .pipe(gulp.dest('dist/'))
                        .pipe(browserSync.reload({stream: true}));

}

exports.css = css; 

// Изображения, шрифты, видео
// Все эти файлы мы просто перенесём в соответствующие им папки внутри dist/. В будущем их можно будет оптимизировать или ещё как-то улучшить, но сейчас опустим это. Вот задача для переноса изображений. Мы уверены, что по аналогии с двумя примерами выше вы разгадаете этот код.

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
            .pipe(gulp.dest('dist/images'))
                    .pipe(browserSync.reload({stream: true}));

}

exports.images = images; 

//Очистка папки dist/
// Перед каждой сборкой полезно удалить все файлы из папки dist/ и загрузить туда новые результаты. Так внутри не останется ничего лишнего. Мы скачали плагин del для очистки файлов. Вот как будет выглядеть задача для Gulp:
function clean() {
  return del('dist');
}

exports.clean = clean; 

//Сборка одной командой
const build = gulp.series(clean, gulp.parallel(html, css, images));

exports.build = build; 

//Отслеживание изменений в файлах
// Теперь сделаем так, чтобы изменения в файлах папки src/ вызывали пересборку. Для этого нужно будет написать функцию, способную следить за изменениями. К счастью, в Gulp есть встроенный метод watch(). Вот как будет выглядеть задача слежения за файлами:

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
}
// const watchapp = gulp.parallel(build, watchFiles);
// exports.watchapp = watchapp; 


//Сервер
// Финальный аккорд нашей минимальной конфигурации. 
// Хочется, чтобы мы видели изменения папки dist/ в реальном времени в браузере. 
// Для этого мы устанавливали browser-sync. Для начала функция создания сервера:
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}


//Теперь функцию serve нужно выполнять параллельно в задаче watchapp, и сервер заработает в режиме реального времени.
const watchapp = gulp.parallel(build, watchFiles, serve); 


exports.watchapp = watchapp; 

//Теперь функция watchapp будет вызываться из терминала просто по команде gulp:
exports.default = watchapp; 

// установить prettier и линтер чтобы на удаленном сервере запускать форматирование?
//? а надо? если плагинами могу?