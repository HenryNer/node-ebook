const env = require('env')
let resUrl
//nginx路径
if (env === 'dev') {
  resUrl = 'http://192.168.1.108:8092'
} else {
  resUrl = 'http://47.115.137.178'
}

const category = [
    'Biomedicine',
    'BusinessandManagement',
    'ComputerScience',
    'EarthSciences',
    'Economics',
    'Engineering',
    'Education',
    'Environment',
    'Geography',
    'History',
    'Laws',
    'LifeSciences',
    'Literature',
    'SocialSciences',
    'MaterialsScience',
    'Mathematics',
    'MedicineAndPublicHealth',
    'Philosophy',
    'Physics',
    'PoliticalScienceAndInternationalRelations',
    'Psychology',
    'Statistics'
  ]

module.exports = {
    resUrl,
    category
}