module.exports = function(grunt) {
	// configure the tasks
	grunt.initConfig({
	// project: {
	// 	app: ['./app'],
	// 	build: ['./build'],
	// 	css: ['<%= project.app %>/styles'],
	// 	js: ['<%= project.app %>/js'],
	// 	components: ['<%= project.app %>/components'],
	// 	templates: ['<%= project.app %>/templates']
    // },
	//copy: {
	//	build: {
	//		expand: true
	//		cwd: 'app/',
	//		//src: [ 'app/**' ],
	//		//src: [ '**' ],
	//		src: [ 'app/*' , '!**/*.sass', '!**/*.coffee', '!**/*.jade' ],
	//		dest: 'build',
	//	},
	//},
	copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**', '!**/sass', '!**/*.coffee', '!**/*.jade'],
                    dest: 'build/'
                }]
            }
        },
	clean: {
		build: {
			src: ['build/**']
		},
		stylesheets: {
			// src: [ 'build/**/*.css', '!build/styles/app.css' ]
			src: [ 'build/**/*.css' ]
		},
		scripts: {
			// src: [ 'build/**/*.js', '!build/js/js.js' ]
			src: [ 'build/**/*.js' ]
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
	},
	express:{
		all:{
			options:{
				port:3000,
				hostname:'localhost',
				bases:['app'],
				livereload: true
			}
		}
	},
	browserSync: {
		dev: {
			bsFiles: {
				src : [
				'<%= project.app %>/**/style.css',
				'<%= project.app %>/**/*.js',
				'<%= project.app %>/content/**/*',
				'<%= project.app %>/**/*.html'
				]
			},
			options: {
				watchTask: true,
				server: '<%= project.app %>/'
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
grunt.loadNpmTasks('grunt-express');
grunt.loadNpmTasks('grunt-browser-sync');


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
		'express'
		,'scripts'
		,'stylesheets'
		,'autoprefixer'
		,'jade'
		,'browserSync'
		,'watch'
	]
);

grunt.registerTask(
	'default',
	'Watches the project for changes, automatically builds them and runs a server.',
		[
			//'clean:build'
			'copy'
			//,'stylesheets'
			//,'express'
			//,'browserSync'
			//,'watch'
		]
	);
};
