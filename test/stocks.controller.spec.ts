import request from 'supertest';
import app from '../src/index';

/**
* Test cases to validate health check api
*/
describe('GET /', () => {
	it('should return welcome success message', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toEqual(200);
		expect(res.text).toBe("Welcome to NodeJS task assignment");
	});
});

/**
* Test cases to validate current stock level api
*/
describe('GET /stocks', () => {
	it('should return calculated stock data object', async () => {
		const res = await request(app).get('/stocks?sku=KED089097/68/09');
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("{\"sku\":\"KED089097/68/09\",\"qty\":4842}");
	});

	it('should return stock data object due to missing transtions value', async () => {
		const res = await request(app).get('/stocks?sku=UMH915687/29/80');
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual("{\"sku\":\"UMH915687/29/80\",\"qty\":511}");
	});

	it('should throw error with invalid skuId', async () => {
		const res = await request(app).get('/stocks?sku=test');
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("{\"status\":400,\"message\":\"Invalid skuId.\"}");
	});

	it('should throw error invalid query parameters', async () => {
		const res = await request(app).get('/stocks?test=123');
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual("{\"status\":400,\"message\":\"Invalid query parameters!\"}");
	});
});