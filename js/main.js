var NUMBER_COLUMNS = 4;
var DESCRIPTION_MAX_SIZE = 140;

var studies = [
		{
			pretitle : "Studies",
			title : "Master in Computer Science",
			place : "UFMG",
			link : "https://www.ufmg.br/",
			address : "Belo Horizonte, Brazil",
			dates : "February 2014 / December 2015",
			description : "Currently researching about Time Series Analysis and DTW, "
					+ "spatial data modeling and NoSQL databases for spatial data."
		},
		{
			pretitle : "Studies",
			title : "B.S. in Computer Science",
			place : "UFMG",
			link : "https://www.ufmg.br/",
			address : "Belo Horizonte, Brazil",
			dates : "February 2009 / December 2013",
			description : "Cumulative GPA: 4.1/5.0"
		},
		{
			pretitle : "Studies",
			title : "Exchange Student",
			place : "FH-Schmalkalden",
			link : "http://www.fh-schmalkalden.de/",
			address : "Schmalkalden, Germany",
			dates : "February 2009 / December 2013",
			description : "Cumulative GPA: 4.2/5.0"
		},
		{
			pretitle : "Studies",
			title : "Secondary and Technical Course",
			place : "CEFET-MG",
			link : "http://www.cefetmg.br/",
			address : "Belo Horizonte, Brazil",
			dates : "February 2006 / December 2008",
			description : "Technical Course of Industrial Informatics. Cumulative GPA: 83/100",
		} ];

var jobs = [
		{
			pretitle : "Work Experience",
			title : "Software Engineer",
			place : "a2bme",
			link : "http://www.a2bme.com/",
			address : "Schmalkalden, Germany",
			dates : "September 2012 / March 2013",
			description : "Designer/coder of a geographic project in Java. "
					+ "Designed the database in the Apache Cassandra and "
					+ "geographic indexes in the Apache Lucene."
		},
		{
			pretitle : "Work Experience",
			title : "IT Technician",
			place : "Cemig",
			link : "http://www.cemig.com.br/",
			address : "Belo Horizonte, Brazil",
			dates : "February 2009 / December 2013",
			description : "Website designer/coder. SharePoint administrator. "
					+ "Proposed, designed, implemented and managed Web solutions"
					+ " to centralize strategic information of the Invoice and"
					+ " Business Relationship Departments at the intranet. "
					+ "Proposed and developed small applications in Flash "
					+ "to assist new employees training."
		},
		{
			pretitle : "Internship",
			title : "IT Technician",
			place : "Cemig",
			link : "http://www.cemig.com.br/",
			address : "Belo Horizonte, Brazil",
			dates : "February 2009 / December 2013",
			description : "Intern in Business Relationship Department. "
					+ "Developed some small applications in Flash and PHP for"
					+ " online customer services. Designed an application to "
					+ "optimize technical reports creation."
		} ];

var publications = [
		{
			pretitle : "Publication",
			title : "OMT-G Designer: A web tool for modeling geographic databases in OMT-G",
			place : "SeCoGIS, 2014",
			description : 'Data modeling tools are useful in software development and in database design. Some advanced modeling tools available in the market go beyond the data modeling process and allow the generation of source code or DDL scripts for RDBMSs based on the modeled schema. This work presents OMT-G Designer, a web tool for modeling geographic databases using OMT-G, an object-oriented data model for geographic applications. The tool provides various consistency checks on the integrity of the schema, and includes a function that maps OMT-G geographic conceptual schemas into physical schemas, including the necessary spatial integrity constraints. The tool was developed using free software and aims to increase the practical and academic uses of OMT-G, by providing an open and platform-independent modeling resource.'
		},
		{
			pretitle : "Publication",
			title : "GeoNoSQL: Geospatial database in NoSQL",
			place : "Computer on the Beach, 2014",
			link : "http://www6.univali.br/seer/index.php/acotb/article/view/5332",
			// description : 'Lizardo, Luís EO, Mirella M. Moro, and Clodoveu A.
			// Davis Jr. "GeoNoSQL: Banco de dados geoespacial em NoSQL." Anais
			// do Computer on the Beach(2014): p-303. (Portuguese)'
			description : 'Geospatial data are created, stored and used today in an unprecedented rate. However, the large volume of data collected from geographic sensors, satellites, social networks and other location services has become a challenge for relational database management systems. In this scenario, non-relational database management systems, known as NoSQL, can provide more efficient solutions to handle big volumes of data. This paper proposes the construction of a spatial NoSQL prototype, called GeoNoSQL, using Apache Cassandra, a non-relational database management system with high scalability and performance. The spatial indexes are built using the library for information retrieval Apache Lucene. Our experiments show that GeoNoSQL performs better than PostGIS, the spatial extension for PostgreSQL.'
		},
// {
// pretitle : "Publication",
// title : "PostgreSQL: uma alternativa para sistemas gerenciadores de banco de
// dados de código aberto",
// place : "Congresso Nacional Universidade, EAD e Software Livre, 2012",
// description : 'Amaral, Hugo Richard, Luis Eduardo Oliveira Lizardo, and
// Arthur Camara Vieira de Souza. "PostgreSQL: uma alternativa para sistemas
// gerenciadores de banco de dados de código aberto." Anais do Congresso
// Nacional Universidade, EAD e Software Livre. Vol. 2. No. 2. 2012.
// (Portuguese)'
// }
];

function addBox(info, column, color) {
	// Clone template
	var boxTemplate = $("#template-box").clone();

	// Set box colors
	boxTemplate.find(".box").addClass("box-" + color);
	boxTemplate.find(".info-place").addClass("info-place-" + color);

	// Set values
	boxTemplate.find(".info-pretitle").text(info.pretitle);
	boxTemplate.find(".info-title").text(info.title);
	boxTemplate.find(".info-place").text(info.place);

	if (info.link) {
		boxTemplate.find(".info-place").attr("href", info.link);
	} else {
		boxTemplate.find(".info-place").removeAttr("href");
	}

	boxTemplate.find(".info-address").text(info.address);
	boxTemplate.find(".info-dates").text(info.dates);

	if (info.description) {
		var text;
		if (info.description.length > DESCRIPTION_MAX_SIZE) {
			text = info.description.substr(0, DESCRIPTION_MAX_SIZE);
			text += '...';
			boxTemplate.find(".box-body p").attr("data-description",
					info.description);
			boxTemplate.find(".btn-link").removeClass("hidden");
		} else {
			text = info.description;
		}
		boxTemplate.find(".box-body p").text(text);
	} else {
		boxTemplate.find(".box-body").remove();
	}

	boxTemplate.find(".btn-link").addClass("btn-" + color);

	// Append box in the column
	$("#column-" + column).append(boxTemplate.html());
}

function getSmallerColumn() {

	var min = 100000, minIndex = 1;
	for ( var i = 1; i <= NUMBER_COLUMNS; i++) {

		var height = $("#column-" + i).position().top
				+ $("#column-" + i).height();

		if (height < min) {
			min = height;
			minIndex = i;
		}
	}
	return minIndex;
}

function clearAllBoxes() {

	$("#profile").hide();
	$("#map").hide();

	for ( var i = 1; i <= NUMBER_COLUMNS; i++) {
		$("#column-" + i).empty();
	}
}

function showPersonal() {
	clearAllBoxes();
	$("#profile").show();
	$("#map").show();	
}

function showEducation() {
	clearAllBoxes();
	for ( var i in studies) {
		addBox(studies[i], getSmallerColumn(), "green");
	}
}

function showExperience() {
	clearAllBoxes();
	for ( var i in jobs) {
		addBox(jobs[i], getSmallerColumn(), "blue");
	}
}

function showPublications() {
	clearAllBoxes();
	for ( var i in publications) {
		addBox(publications[i], getSmallerColumn(), "yellow");
	}
}

function selectNav(nav){
	$(".nav-link").parent().removeClass("disabled");
	$("#nav-" + nav).addClass("disabled");
}

function expandDescription(btn) {

	if (btn.children().is('.glyphicon-chevron-down')) {
		btn.prev().text(btn.prev().attr("data-description"));
	} else {
		btn.prev().text(
				btn.prev().attr("data-description").substr(0,
						DESCRIPTION_MAX_SIZE)
						+ '...');
	}

	btn.children().toggleClass("glyphicon-chevron-down glyphicon-chevron-up");
}

function expandMap(btn) {
	
	if (btn.children().is('.glyphicon-resize-full')) {
		clearAllBoxes();
		
		$("#map").appendTo('#column-expanded');
		$("#map").show();
		
		$("#map-canvas").height($("#map-canvas").height()*2.5);
		initMapBig();
	}
	else {
		$("#map").prependTo('#column-map');
		$("#map-canvas").height($("#map-canvas").height()/2.5);
		initMapSmall();
		initialize();
	}	
	
	btn.children().toggleClass("glyphicon-resize-full glyphicon-resize-small");
}


function initialize() {

	showPersonal();

	for ( var i = 0;; i++) {
		if (i < studies.length) {
			addBox(studies[i], getSmallerColumn(), "green");
		}

		if (i < jobs.length) {
			addBox(jobs[i], getSmallerColumn(), "blue");
		}

		if (i < publications.length) {
			addBox(publications[i], getSmallerColumn(), "yellow");
		}

		if (i >= studies.length && i >= jobs.length)
			break;
	}
}

$(document).ready(function() {
	initialize();
	selectNav("home");
});
