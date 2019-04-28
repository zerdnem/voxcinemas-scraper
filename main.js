const got = require("got");
const cheerio = require("cheerio");

const cinemas = [
	{
		id: 0,
		name: "City Centre",
		location: "Sharjah",
		url: "https://uae.voxcinemas.com/showtimes?c=city-centre-sharjah"
	}
];

const data = {
	title: [],
	rating: [],
	language: [],
	runtime: [],
	link_to_page: [],
	cinema_type: [],
	seat_type: [],
	show_time: [],
	booking_url: []
};

(async () => {
	try {
		const res = await got(
			"https://uae.voxcinemas.com/showtimes?c=city-centre-sharjah"
		);
		const $ = cheerio.load(res.body);
		// TITLE
		$("aside.movie-hero")
			.find("h2")
			.each((i, e) => {
				data.title.push($(e).text());
			});
		// RUNTIME
		$("aside.movie-hero")
			.find("span.classification")
			.each((i, e) => {
				data.rating.push($(e).text());
			});
		// LANGUAGE & RATING
		$("aside.movie-hero")
			.find("span.tag")
			.each((i, e) => {
				if (i % 2 == 0) {
					data.language.push($(e).text());
				} else {
					data.runtime.push($(e).text());
				}
			});
		// LINK
		$("aside.movie-hero")
			.find("a.read-more")
			.each((i, e) => {
				data.link_to_page.push($(e).attr("href"));
			});
		// CINEMA TYPE
		$("ol.showtimes")
			.find($("strong"))
			.each((i, e) => {
				data.cinema_type.push($(e).text());
			});
		// SEAT TYPE
		$("ol.showtimes")
			.find($("strong"))
			.each((i, e) => {
				data.seat_type.push($(e).text());
			});
		// SHOW TIME
		//TODO: show_time & booking_url should be a separate object called show_schedule or something
		//Example:
		// show_schedule: {
		// 	show_time: [],
		// 	booking_url: []
		// }
		$("ol.showtimes").each((i, e) => {
			data.show_time.push(
				$(e)
					.find($("a.action"))
					.text()
			);
		});
		// BOOKING URL
		//TODO: this is not correct
		$("ol.showtimes")
			.find($("a.action"))
			.each((i, e) => {
				data.booking_url.push($(e).attr("href"));
			});

		data.title.map((movie, index) => {
			console.log({
				title: movie,
				runtime: data.runtime[index],
				rating: data.rating[index],
				language: data.language[index],
				link_to_page: data.link_to_page[index],
				cinema_type: data.cinema_type[index],
				seat_type: data.seat_type[index],
				show_time: data.show_time[index],
				booking_url: data.booking_url[index]
			});
		});
	} catch (e) {
		console.log(e);
	}
})();
