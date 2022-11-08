import moment from 'moment'

export default date => {
    return moment(date * 1000).format('DD/MM/YYYY HH:mm:ss')
}
