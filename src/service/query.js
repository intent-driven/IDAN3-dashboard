import {queryIntent} from "./service";

// query intent names and layer
export const queryNamesAndLayer = () => {
  const sql = `
    SELECT ?intent ?type  WHERE {
    ?intent ?pred icm:Intent .
    ?intent cem:layer ?type
    } LIMIT 10`;
  return queryIntent(sql)
}

// query expectation from intent name
export const queryExpectation = (intentName) => {
  const sql = `
  SELECT ?expectation ?target ?oo ?pp1 ?oo1 ?pp2 ?oo2 ?pp3 ?oo3 WHERE {
    ?i a icm:Intent ;
        icm:hasExpectation ?expectation .
     ?expectation logi:allOf ?p .
     ?p ?pp ?oo .
     ?expectation icm:target ?target .
     optional {?oo ?pp1 ?oo1}
     optional {?oo1 ?pp2 ?oo2}
     optional {?oo2 ?pp3 ?oo3}
     filter (?pp1 != rdf:type)
     filter (?pp2 != rdf:type)
     filter (?pp3 != rdf:type)
    filter (?i = idan:${intentName})
} LIMIT 100`;
  return queryIntent(sql)
}

// intent report and status from intent name
export const queryReportAndStatus = (intentName) => {
  const sql = `
  SELECT ?intent  ?report ?state ?number ?timestamp WHERE {
     ?report icm:reportsAbout ?intent .
     ?report icm:handlingState ?state .
	   ?report icm:reportTimestamp ?timestamp .
     ?report icm:reportNumber ?number
   filter (?intent = idan:${intentName})
  } 
  order by desc (?number)
  LIMIT 10`;
  return queryIntent(sql)
}

// query report expectation from intentreport
export const queryReportExpectation = (intentReportName) => {
  const sql = `
  SELECT distinct ?i ?expectation ?target ?rep ?pred ?value1 ?pp13 ?value2 ?pp14 ?value3 ?ts ?n WHERE {
    ?i a icm:IntentReport ;
        icm:hasExpectationReport ?expectation .
     ?i icm:reportTimestamp ?ts .
     ?i icm:reportNumber ?n .
     ?expectation icm:target ?target .
     ?p icm:reportsAbout ?rep .
     ?expectation ?pred ?p .
     ?p ?pp12 ?value1 .
     ?value1 ?pp13 ?value2 .    
     optional{?value2 ?pp14 ?value3} .
     filter (?prep != icm:reportsAbout)
     filter (?pp12 != rdf:type)
     filter (regex(str(?value1), "_g_" ))
     filter (?pp14 != rdf:type)
     filter (?pred = icm:degraded || ?pred = icm:compliant)
     filter (?i = idan:${intentReportName})
} order by (?expectation) LIMIT 100`;
  return queryIntent(sql)
}
// intent report details
export const queryReportDetails = (intentName) => {
  const sql = `
  SELECT ?intent ?timestamp ?state WHERE {
     ?intent ?pred icm:IntentReport .
     ?intent cem:layer ?o .
     ?intent icm:reportTimestamp ?oo .
     ?oo ?pp1 ?oo1 .   
     ?intent icm:handlingState ?state 
	 filter (?intent = idan:${intentName})
  }
  LIMIT 10`;
  return queryIntent(sql)
}
