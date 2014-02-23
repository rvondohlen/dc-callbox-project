module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			files: ['sass/*.scss', 'index.html'],
			tasks: 'sass:dev'
		},

		sass: {
			dev: {
				files: {
					'css/style.css': 'sass/style.scss'	
				}
			}
		}
	});

	grunt.registerTask('default', 'sass:dev');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
}