/*******************************************************
 * Author: John Andrew Loudon                          *
 * (c) 2022 A Roman Empire Divided, John Andrew Loudon *
 *                                                     *
 *******************************************************
 * Description
 * 
 * This is a build file for this shopify theme.
 * Tools used: Gulp, NodeJS, SCSS, Liquid, TypeScript
 *
 */

"use strict";

/* depedencies */
const gulp         = require("gulp");
const $            = require("gulp-load-plugins")();

const browserify   = require("browserify");
const tsify        = require("tsify");

const autoprefixer = require("autoprefixer");
const sassCompiler = require("node-sass");

const source       = require("vinyl-source-stream");
const buffer       = require("vinyl-buffer");

const log          = require("fancy-log");

const del          = require("del")
const path         = require("path");

/* Extensions */

const $$ = $.sass(sassCompiler);

/* Constant modifiers */

const paths = {

    "typescript" : path.join(__dirname, "ts"),
    "scss" : path.join(__dirname, "scss"),

    "entry" : path.join(__dirname, "ts/theme.ts"),

    "build" : path.join(__dirname, "../assets")
};

/* Gulp Task Functions */

function BuildSCSS ( done ) {

    gulp.src([paths.scss + "/*.scss.liquid", paths.scss + "/*.scss"])
        .pipe($$({
            outputStyle: "expanded"
        })
            .on("error", $$.logError))
        .pipe($.postcss([
            autoprefixer({ casecade : false })
        ]))
            .on("error", log)
        .pipe($.rename((path) => {
            if ( path.extname.indexOf(".liquid") >= -1 ) {
                path.basename = path.basename.replace(".scss", ".css");
                path.extname = ".liquid";
            }
            else {
                path.extname = ".css";
            }
        }))
        .pipe($.replace(`"{{`, "{{"))
        .pipe($.replace(`}}"`, "}}"))
        .pipe($.cleanCss())
            .on("error", log)
        /*.pipe($.rename((path) => {
            path.basename += ".min";
        }))*/
        .pipe(gulp.dest(paths.build))
    ;

    done();

}

function BuildTypeScript ( done ) {

    let $browserify = browserify({
        "entries" : paths.entry
    });

    $browserify
        .plugin(tsify, {
            "target" : "es5",
            "module" : "commonjs",
            "lib" : ["dom", "es5", "es2015"]
        })
        .bundle()
            .on("error", log)
        .pipe(source("theme.js"))
            .on("error", log)
        .pipe(buffer())
            .on("error", log)
        .pipe($.uglify())
            .on("error", log)
        .pipe(gulp.dest(paths.build))

    done();

}

/* Gulp Tasks */

function WatchSCSS ( done ) {
    gulp.watch(paths.scss + "/**/*.{scss,scss.liquid}")
        .on("change", BuildSCSS)
    ;
    done();
}

function WatchTypeScript ( done ) {
    gulp.watch(paths.typescript + "/**/*.ts")
        .on("change", BuildTypeScript)
    ;
    done();
}

/* Export */

let WatchTasks = [WatchTypeScript, WatchSCSS];

let BuildTasks = [BuildSCSS, BuildTypeScript];

exports.default = gulp.parallel(WatchTasks, BuildTasks);
