import http from 'k6/http';
import { check } from 'k6';
import { userData } from '../data/faker.js';
import { options as config} from '../config/k6.options.js';
export { handleSummary } from './base/base.test.js';
export const options = config


// Set the base URL of the API
const baseUrl = 'https://fakestoreapi.com/users';

// The main function that will be executed for each VU (virtual user)
export default function() {
	
	// Create a random user using the userData function from the payload.js file
	const message = userData();
	
	// Convert the user data to JSON format
	const data = JSON.stringify(message);

	// Set the headers for the POST request
	let headers = {
		'Content-Type': 'application/json'
	}

	// Send the POST request to the API with the generated user data and headers
	let response = http.post(`${baseUrl}`, data, {
		headers: headers
	});

	// Check the response status code and response time using the k6 check function
	check(response, {
		// The status code should be 200
		'status is 200': (r) => r.status === 200,
        // The response time should be less than 400ms
        'response time < 400ms': (r) => r.timings.duration < 400
	});

	// If the response status code is not 200, print the response JSON to the console
	if (response.status !== 200) {
		console.log(response.json())
	}
}