const path  = require('path');
const gulp  = require('gulp');
const ugjs = require('gulp-uglify');
const watch = require('gulp-watch');
const named = require('vinyl-named');
const postcss = require('gulp-postcss'); //postcss本身
const webpackStream = require('webpack-stream');
const watchPath = require('gulp-watch-path');

const rename = require('gulp-rename');
// const ifElse = require('gulp-if-else');
const base64       = require('gulp-base64');
const autoprefixer = require('autoprefixer');
const precss       = require('precss'); //提供像scss一样的语法
const cssnano      = require('cssnano');  //更好用的css压缩!
const sass         = require('gulp-sass');


var webpackConfig = {
	resolve: {
		root: path.join(__dirname, 'node_modules'),
		extensions: ['', '.js', '.vue', '.scss', '.css']
	},
	output: {
		// publicPath: ''+ CDN +'/static/',
		filename: '[name].js',
		chunkFilename: 'es6/[id].js?[hash]'
	},
	module: {
		loaders: [
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/},
		]
	},
	babel: { //配置babel
		"presets": ["es2015",'stage-2'],
		"plugins": ["transform-runtime"]
	}
};

const processes = [
	autoprefixer({browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%']}),
	precss,
	cssnano
];

const src  = {
	fonts: './src/**/*.{eot,svg,ttf,woff}',
	images: './src/**/*.{png,jpg,jpeg}',
	js: './src/**/*.js',
	sass: './src/**/*.scss',
	json : './src/**/*.json',
	views: './src/**/*.wxml'
};
const dist = {
	css: './dist/',
	fonts: './dist/',
	images: './dist/',
	js: './dist/',
	views: './dist/'
};
gulp.task('dev',function() {
	gulp.start('views','sass','images','fonts','js','json');
});
gulp.task('build',function() {
	gulp.start('sass:build','js:build');
	views();
	images();
	fonts();
	json();
});
gulp.task('views', function () {
	watch([src.views]).on('change',function() {
		views()
	})
});
gulp.task('json', function () {
	watch([src.json]).on('change',function() {
		json()
	});
});
gulp.task('sass', function () {
	watch([src.sass]).on('change', function () {
		gulp.src(src.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processes))
		.pipe(base64({
			extensions: ['png', /\.jpg#datauri$/i],
			maxImageSize: 10 * 1024 // bytes,
		}))
		.pipe(rename({
			extname: ".wxss"
		}))
		.pipe(gulp.dest(dist.css));
	});
});

gulp.task('images', function () {
	watch([src.images]).on('change',function() {
		images();
	})
});
gulp.task('fonts', function () {
	watch([src.fonts]).on('change',function() {
		fonts()
	})
});
gulp.task('js', function () {
	
	watch([src.js], function (event) {
		var paths = watchPath(event, src.js, dist.js);
		compileJS(paths.srcPath);
	})
	
});
gulp.task('sass:build', function () {
	gulp.src(src.sass)
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss(processes))
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(postcss(processes))
	.pipe(rename({
		extname: ".wxss"
	}))
	.pipe(gulp.dest(dist.css));
});
gulp.task('js:build', function () {
	gulp.src([src.js])
		.pipe(ugjs())
		.pipe(gulp.dest(dist.js));
});
function compileJS(path) {
	
	return gulp.src(path)
	.pipe(named(function (file) {
		var path = JSON.parse(JSON.stringify(file)).history[0];
		var target = path.split('src/')[1];
		return target.substring(0,target.length - 3);
	}))
	.pipe(webpackStream(webpackConfig))
	.on('error',function(err) {
		this.end()
	})
	.pipe(gulp.dest(dist.js))
}
function fonts() {
	
	gulp.src(src.fonts)
	.pipe(gulp.dest(dist.fonts));
}
function images() {
	gulp.src(src.images)
	.pipe(gulp.dest(dist.images));
}
function views() {
	gulp.src(src.views)
	.pipe(gulp.dest(dist.views));
}
function json() {
	gulp.src(src.json)
		.pipe(gulp.dest(dist.js));
}