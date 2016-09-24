var path  = require('path');
var gulp  = require('gulp');
var ugjs = require('gulp-uglify');
var watch = require('gulp-watch');
var named = require('vinyl-named');
var postcss = require('gulp-postcss'); //postcss本身
var webpackStream = require('webpack-stream');
var watchPath = require('gulp-watch-path');
var chalk = require('chalk');
var rename = require('gulp-rename');
var ifElse = require('gulp-if-else');
var base64       = require('gulp-base64');
var autoprefixer = require('autoprefixer');
var precss       = require('precss'); //提供像scss一样的语法
var cssnano      = require('cssnano');  //更好用的css压缩!
var sass         = require('gulp-sass');

var isBuild = false;

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

var processes = [
	autoprefixer({browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%']}),
	precss,
	cssnano
];

var src  = {
	fonts: './src/**/*.{eot,svg,ttf,woff}',
	images: './src/**/*.{png,jpg,jpeg}',
	js: './src/**/*.js',
	sass: './src/**/*.scss',
	wxss : './src/**/*.wxss',
	wxml : './src/**/*.wxml',
	json : './src/**/*.json',
	views: './src/**/*.{html,wxml}'
};
var dist = './dist';
gulp.task('dev',function() {
	gulp.start('views','sass','wxss','images','fonts','js','json');
});
gulp.task('build',function() {
	isBuild = true;
	build(function () {
		setTimeout(function() {
			console.log(chalk.green('	Build success!'))
		},0)
	});
});
gulp.task('views', function () {
	watch([src.views]).on('change',function() {
		views();
	})
});
gulp.task('json', function () {
	watch([src.json]).on('change',function() {
		json()
	});
});
gulp.task('sass', function () {
	watch([src.sass], function (event) {
		var paths = watchPath(event, src.sass, dist);
		compileSass(paths.srcPath)
	});
});

gulp.task('wxss',function() {
	watch([src.wxss], function (event) {
		var paths = watchPath(event, src.wxss, dist);
		compileWxss(paths.srcPath); // 编译 .wxss
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
		var paths = watchPath(event, src.js, dist);
		compileJS(paths.srcPath);
	})
});

gulp.task('view:build',function() {
	views()
})
gulp.task('sass:build', function () {
	compileSass(src.sass)
});
gulp.task('wxss:build', function () {
	compileWxss(src.wxss)
});
gulp.task('js:build', function () {
	compileJS([src.js]);
});
function compileJS(path,cb) {
	
	gulp.src(path)
	.pipe(named(function (file) {
		var path = JSON.parse(JSON.stringify(file)).history[0];
		var target = path.split('src/')[1];
		return target.substring(0,target.length - 3);
	}))
	.pipe(webpackStream(webpackConfig))
	.on('error',function(err) {
		this.end()
	})
	.pipe(ifElse(isBuild === true,ugjs))
	.pipe(gulp.dest(dist))
	cb && cb();
}
function compileWxss(src) {
	gulp.src(src)
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(postcss(processes))
	.pipe(gulp.dest(dist))
}
function compileSass(src) {
	gulp.src(src)
	.pipe(sass().on('error', sass.logError))
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(ifElse(isBuild === true,function() {
		return postcss(processes);
	}))
	.pipe(rename({
		extname: ".wxss"
	}))
	.pipe(gulp.dest(dist));
}
function fonts() {
	
	gulp.src(src.fonts)
	.pipe(gulp.dest(dist));
}
function images() {
	gulp.src(src.images)
	.pipe(gulp.dest(dist));
}
function views() {
	gulp.src(src.views)
	.pipe(rename({
		extname: ".wxml"
	}))
	.pipe(gulp.dest(dist));
}
function json() {
	gulp.src(src.json)
	.pipe(gulp.dest(dist))
}
function build(cb) {
	gulp.start('sass:build','wxss:build','js:build');
	views();
	images();
	fonts();
	json();
	cb && cb()
}