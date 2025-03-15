import StatsD from 'node-statsd';

const statsD = new StatsD({
    host: 'localhost',
    port: 8125,        
    prefix: 'webapp'  
});
 
export default statsD;