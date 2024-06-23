let username = 'coalition';
let password = 'skills-test';
let auth = btoa(`${username}:${password}`);

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ul = document.getElementById('authors');
let pacient_index = 3;
let arr = [];

fetchData();


function fetchData() {
	fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
	headers: {
		'Authorization': `Basic ${auth}`
		}
	})
	.then(function (response) {
		if (response.ok) {
			return response.json();
		}
		throw response;
	})
.then(function(data) {
	let authors = data;
	ul.innerHTML = "";
	
	return authors.map(function(author) {
		let li = createNode('li');
		let img = createNode('img');
		let span = createNode('span');
		img.src = author.profile_picture;
		img.setAttribute('style', 'width: 48px; height: 48px; margin-right: 12px;');
		span.innerHTML = `<span style="display: flex; justify-content: space-between;align-items: center;width: 286px">
			<span style="font: normal normal bold 14px/19px Manrope; color: #072635;">${author.name}
				
				<div style="font: normal normal normal 14px/19px Manrope; color: #707070;">${author.gender}, 
					<span class="age">${author.age}</span>
				</div>
			</span>
			<div class="more">
				<img src="./image/icon/more_horiz.png" alt="more_horiz" style="width: 18px; height: 4px; margin: 0 30px 4px 0;"
			</div>
		</span>`;
		append(li, img);
		append(li, span);
		append(ul, li);	

		arr.push(author);
	}),
	drawChart(arr[pacient_index].diagnosis_history),
	profile(authors),
	diagnostic_list(authors[pacient_index].diagnostic_list),
	lab_results(authors[pacient_index].lab_results)
})
.catch(function (error) {
	console.warn(error);
});
}

function drawChart(authors) {

	document.querySelector(".myChart").innerHTML = '<canvas id="myChart"></canvas>';

	const array_Month = authors.map(el=>el.month.substring(0, 3) + ' ' + el.year);

	const array_Diastolic = authors.map(el=>el.blood_pressure.diastolic.value);
	const array_Systolic = authors.map(el=>el.blood_pressure.systolic.value);

	const mydata = {
		labels: array_Month.reverse().slice(-selectedValue),
		datasets: [{
			label: 'Diastolic',
			data: array_Diastolic.reverse().slice(-selectedValue),
			borderColor: '#7E6CAB',
			cubicInterpolationMode: 'monotone',
		},{ 
			label: 'Systolic',
			data: array_Systolic.reverse().slice(-selectedValue),
			borderColor: '#C26EB4',
			cubicInterpolationMode: 'monotone', 
		}]
	};

	new Chart(document.getElementById('myChart'), {
		type: 'line',
		data: mydata,
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	});

	document.getElementById("Systolic").innerHTML = authors[0].blood_pressure.systolic.value;
	document.getElementById("Diastolic").innerHTML = authors[0].blood_pressure.diastolic.value;
	document.getElementById("respiratory_rate_value").innerHTML = authors[0].respiratory_rate.value + " bpm";
	document.getElementById("respiratory_rate_levels").innerHTML = authors[0].respiratory_rate.levels;
	document.getElementById("temperature_value").innerHTML = authors[0].temperature.value + "°F";
	document.getElementById("temperature_levels").innerHTML = authors[0].respiratory_rate.levels;
	document.getElementById("heart_rate_value").innerHTML = authors[0].heart_rate.value + " bpm";
	document.getElementById("heart_rate_levels").innerHTML = authors[0].heart_rate.levels;
};

function profile(authors) {

	document.getElementById('profile_picture').getElementsByTagName('img')[0].src = authors[pacient_index].profile_picture;

	document.getElementById("name").innerHTML = authors[pacient_index].name;
	document.getElementById("date_of_birth").innerHTML = authors[pacient_index].date_of_birth;
	document.getElementById("gender").innerHTML = authors[pacient_index].gender;
	document.getElementById("phone_number").innerHTML = authors[pacient_index].phone_number;
	document.getElementById("emergency_contact").innerHTML = authors[pacient_index].emergency_contact;
	document.getElementById("insurance_type").innerHTML = authors[pacient_index].insurance_type;


	let li_background = ul.getElementsByTagName("li");

	for (let i = 0; i < li_background.length; i++) {
		li_background[i].setAttribute('style', 'background: none');
	};

	li_background[pacient_index].setAttribute('style', 'background: #01F0CE4F');
};

function diagnostic_list(authors) {
	document.getElementById('table_line').innerHTML = "";
	return authors.map(function(author) {
		let li = createNode('div');
		li.innerHTML = `<div class="table align-items_center">
			<div class="problem">${author.name}</div>
			<div class="description">${author.description}</div>
			<div class="status">${author.status}</div>
		</div>
		<div class="horizontal_line"></div>`;
		append(document.getElementById('table_line'), li);
	})
};

function lab_results(authors) {
	document.getElementById('lab').innerHTML = "";
	return authors.map(function(author) {
		li =  createNode('div');
		li.innerHTML = `<div class="item align-items_center">
			<p>${author}</p>
			<img src="./image/icon/download.svg" alt="download">
			</div>`
		append(document.getElementById('lab'), li);
	})	
};

let selectedValue = 6;

function onSelectChange(event) {
	selectedValue = event.target.value;

	drawChart(arr[pacient_index].diagnosis_history);
};


ul.addEventListener('click', event => {
	let dots = document.getElementsByClassName("more");
		
	pacient_index = Array.from(dots).indexOf(event.target);

	if (pacient_index > -1) {
		drawChart(arr[pacient_index].diagnosis_history);
		profile(arr);
		diagnostic_list(arr[pacient_index].diagnostic_list);
		lab_results(arr[pacient_index].lab_results);
	}
		
});

var searchList = function () {
	var res  = document.getElementById("result");
	s = ''; 
	
	arr_search = arr.map(el => el.name);
	
	for( var i = 0; i < arr.length; ++i )
	  	if( arr_search[i].indexOf(this.value) !== -1 ) {
			s += "<div>" + arr_search[i] + "</div>";
	  	};

	res.innerHTML = document.getElementById("text").value !== '' ? s : '' ;
};


document.getElementById("search").addEventListener("click", function() {
	if (document.getElementById("text").style.display == "block") {
		document.getElementById("text").style.display = "";	
	} else {document.getElementById("text").style.display = "block"};
});

document.getElementById("text").addEventListener("input", searchList);
document.getElementById("result").addEventListener("click", function(e){
	if(e.target.tagName == 'DIV'){
		document.getElementById("text").value = e.target.innerHTML;
	};

	let arr_result = arr.map((el)=>el.name);
	for (let i=0; i < arr_result.length; ++i) {
		
		if (arr_result[i] == e.target.innerHTML) {
			pacient_index = i;
		};
	};
	
	drawChart(arr[pacient_index].diagnosis_history);
	profile(arr);
	diagnostic_list(arr[pacient_index].diagnostic_list);
	lab_results(arr[pacient_index].lab_results);
	
	document.getElementById("result").innerHTML = document.getElementById("text").value = "";
});