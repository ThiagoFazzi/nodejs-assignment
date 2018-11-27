//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();


chai.use(chaiHttp);
describe('/GET vehicle logs', () => {
    it('it should GET 5 vehicle logs', (done) => {
      chai.request(server)
          .get('/vehicle/vehicle.test-bus-1/limit/5')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
            done();
          });
    });
});