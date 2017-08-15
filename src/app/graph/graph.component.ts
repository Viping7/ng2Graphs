import {
	Component, AfterViewInit, ElementRef, NgZone,Input
}
from '@angular/core';
import * as d3 from 'd3';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

	data = [{
		val: 10
                }, {
		val: 30
                }, {
		val: 60
                }];
	constructor(private el: ElementRef, private zone: NgZone) {}
	@Input() graphType; 
	changeData() {
		this.data = [{
			val: Math.random() * 100
                }, {
			val: Math.random() * 100
                }, {
			val: Math.random() * 100
                }];
		this.zone.run(() => {
			this.loadGraph()
		});
	}
	canvas = d3.select(this.el.nativeElement).append('svg').attr('width', '100%').attr('height', 224);

	loadGraph() {
		var perdata = this.data;
		if(this.graphType=='dial'){
		var data = [[{
				r: 100,
				startAngle: 0.7,
				endAngle: 5.6,
				color: '#eee',
				stcx: 58,
				stcy: 76

                    }, {
				r: 100,
				startAngle: 0.7,
				endAngle: 5.6,
				color: '#F15F74',
				stcx: -58,
				stcy: 76
                    }],
                    [{
				r: 80,
				startAngle: 0.7,
				endAngle: 5.6,
				color: '#eee',
				stcx: 44,
				stcy: 60
                    }, {
				r: 80,
				startAngle: 0.7,
				endAngle: 5.6,
				color: '#5580E6',
				stcx: -44,
				stcy: 60
                    }], [{
				r: 60,
				startAngle: 0.7,
				endAngle: 5.6,
				color: '#eee',
				stcx: 30,
				stcy: 45
                    }, {
				r: 60,
				startAngle: 0.7,
				endAngle: 3.1415926535898,
				color: '#98CB4A',
				stcx: -30,
				stcy: 45
                    }]];
		var targetVal;
		if (perdata[0].val > perdata[1].val) {
			if (perdata[0].val > perdata[2].val) {
				targetVal = perdata[0].val;
			} else {
				targetVal = perdata[2].val;
			}
		} else {
			if (perdata[1].val > perdata[2].val) {
				targetVal = perdata[1].val;
			} else {
				targetVal = perdata[2].val;
			}
		}
		for (var i = 0; i < perdata.length; i++) {
			var percentage = (perdata[i].val / targetVal);
			var radians = percentage * 4.9;
			data[i][1].endAngle = radians + 0.7;
			if (radians == 4.9) {
				data[i][0].color = data[i][1].color;
			}
			console.log(data[i][1].endAngle);
		}

		for (var i = 0; i < data.length; i++) {
			var group1 = this.canvas.append('g').attr('transform', "translate(100,130)");
			var arc = d3.arc().innerRadius(function (d) {
				return d.r - 10;
			}).outerRadius(function (d) {
				return d.r;
			});
			var acr1 = d3.arc().innerRadius(function (d) {
				return d.r - 10;
			}).outerRadius(function (d) {
				return d.r;
			}).startAngle(function (d) {
				return d.startAngle;
			}).endAngle(function (d) {
				return d.endAngle;
			});
			group1.append('path').attr('fill', '#eee').attr('transform', 'rotate(180)');
			var paths = group1.selectAll('path').data(data[i]).attr('d', acr1).enter().append('path').attr('transform', 'rotate(180)').attr('fill', function (d) {
				return d.color;
			}).transition().duration(1000).attrTween("d", function (d) {
				var start = {
					startAngle: 0.7,
					endAngle: 0.7
				};
				var interpolate = d3.interpolate(start, d);
				return function (t) {
					return arc(interpolate(t));
				};
			}).attr('class', "lines");
			group1.selectAll('circle').data(data[i]).enter().append('circle').attr('r', 8).attr('fill', function (d) {
				return d.color;
			}).attr('transform', function (d) {
				return "translate(" + d.stcx + ',' + d.stcy + ")";
			});
		}
	}
else{
if(this.graphType=='line'){
	var group=this.canvas.append('g').attr("transform","translate(500,100)").attr("width",500).attr("height",300).attr("fill","#e5d123");
	group.selectAll('rect').data(this.data).enter().append('rect').attr('width',50).attr('fill',"#0fddad").attr("transform","translate(100,0)").attr('x',function(d,i){return i*90}).attr('y',function(d,i){return 100-d.val}).transition().attr('height',function(d){return d.val});
}
}
	}
	ngAfterViewInit() {
		this.loadGraph();
	}

}