module.exports = function(grunt) {
	// configure the tasks
	grunt.initConfig({
	copy: {
		build: {
			cwd: 'source',
			//src: [ '**/app' ],
			src: [ '**', '!**/*.styl', '!**/*.coffee', '!**/*.jade' ],
			dest: 'build',
			expand: true
		},
	},
	clean: {
		build: {
			src: [ 'build' ]
		},
		stylesheets: {
			src: [ 'build/**/*.css', '!build/styles/app.css' ]
		},
		scripts: {
			src: [ 'build/**/*.js', '!build/js/js.js' ]
		},
	},

	sass: {
		dist: {
			options: {
				style: 'expanded'
			},
			files: {
				'app/styles/app.css' : 'app/sass/app.sass'
			}
		}
	},
	watch: {
		css: {
			files: 'app/sass/*.sass',
			tasks: ['sass', 'autoprefixer']
		},
		scripts: {
			files: 'app/**/*.coffee',
			tasks: [ 'scripts' ]
		},
		jade: {
			files: 'app/**/*.jade',
			tasks: [ 'jade' ]
		},
		copy: {
			files: [ 'app/**', '!app/**/*.sass', '!app/**/*.jade' ],
			tasks: [ 'copy' ]
		}
	},
	autoprefixer: {
		build: {
			expand: true,
			cwd: 'app',
			src: [ '**/*.css'],
			dest: 'app'
		}
	},
	cssmin: {
		build: {
			files: {
				'build/styles/app.css': [ 'app/styles/*.css' ]
			}
		}
	},
	uglify: {
		build: {
			options: {
				mangle: false
			},
			files: {
				'build/js/js.js': [ 'app/js/*.js' ]
			}
		}
	},
	// jade: {
	// 	compile: {
	// 		options: {
	// 			data: {}
	// 		},
	// 		files: [{
	// 			//cwd: 'source',
	// 			'app' : [ '**/*.jade' ]
	// 			//ext: '.html'
	// 		}]
	// 	}
	// },
	jade: {
		compile: {
			options: {
				pretty: true,
				data:{
					myInfo: grunt.file.readJSON('app/data.json')
				}
			},
			files: {
				//'dest/path/': ['path/to/src/*.jade']
				'app/index.html': ['app/view/template.jade']
			}
		}
	}
});

// load the tasks
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jade');

grunt.registerTask(
	'stylesheets',
	'Compiles the stylesheets.',
	[
		'sass'
		,'autoprefixer'
		,'cssmin'
		,'clean:stylesheets'
	]
);

grunt.registerTask(
	'scripts',
	'Compiles the JavaScript files.',
	[
		'uglify'
		,'clean:scripts'
	]
);

grunt.registerTask(
	'devscripts',
	'Compiles the JavaScript files.',
	[
		'uglify:dev'
		,'clean:scripts'
	]
);
grunt.registerTask(
	'build',
	'Compiles all of the assets and copies the files to the build directory.',
		[
			'clean:build'
			,'stylesheets'
			,'scripts'
			,'copy'
			,'jade'
		]
	);

grunt.registerTask(
	'dev',
		[
			'scripts'
			,'stylesheets'
			,'autoprefixer'
			,'jade'
			,'watch'
		]
	);
};
