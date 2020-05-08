const env = require('./env')
let resUrl
let dbHost
let dbUser
let dbPwd
//nginx路径
if (env === 'dev') {
  resUrl = 'http://192.168.1.108:8092'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = 'password'
} else {
  resUrl = 'http://47.115.137.178'
  dbHost = '47.115.137.178'
  dbUser = 'root'
  dbPwd = 'Aa123456.'
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
    category,
    dbHost,
    dbPwd,
    dbUser
}