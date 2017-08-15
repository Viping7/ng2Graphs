import {
	Component, AfterViewInit, ElementRef, NgZone,Input
}
from '@angular/core';
import * as d3 from 'd3';
var height=500;
var width=500;
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
	constructor(private el: ElementRef, private zone: NgZone) {
        
    }
    
	canvas = d3.select(this.el.nativeElement).append('svg').attr('width', width+20).attr('height', height+20);
	@Input() graphType; 
	changeData() {
        d3.selectAll('g').remove('g');
        this.data = [{
			val: Math.random() * 1000
                }, {
			val: Math.random() * 1000
                }, {
			val: Math.random() * 1000
                }];
		this.zone.run(() => {
			this.loadGraph()
		});
	}

	loadGraph() {
        console.log(this.data);
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
                
		var barData = [15,255,355,768,765,823,245,728,315,88,174,85,96,512,44];
            var yscale=d3.scaleLinear()
                        .domain([0,1000])
                        .range([0,height]);
            var xscale=d3.scaleBand()
                        .domain(d3.range(0,barData.length))
                        .range([0,width]);
            var tooltip=d3.select(this.el.nativeElement).append('div')
                        .style('position','absolute')
            .style('background','#fff')
            .style('padding','10px')
            .style('border','1px solid #aaa')
            .style('opacity','0')
            var group=this.canvas.append('g')
             
            var barGraph=group.selectAll('rect')
                        .data(barData)
                        .enter()
                        .append('rect')
                        .attr('width',xscale.bandwidth())
                        .attr('fill',"#138989")
                        .attr("transform","translate(20,0)")
                        .attr('x',function(d,i){return xscale(i)})
                        .attr('y',function(d,i){return (height)})
                        .attr('height',0)
                        .on('mouseover',function(d){
                            tooltip.transition().style('opacity','1')
                            tooltip.style('top',(d3.select(this).attr('y')-40+'px'))       
                                    .style('left',(d3.select(this).attr('x')+'px'))  
                                    .html(d)
                            d3.select(this).style('opacity',0.5).style('cursor','pointer')
                        }) .on('mouseout',function(d){
                            tooltip.transition().style('opacity','0')
                            d3.select(this).style('opacity',1)
                        });
                barGraph.transition().duration(1000).delay(function(d,i){return i*100}).attr('height',function(d){return yscale(d)}).attr('y',function(d,i){return (height-yscale(d))}).ease(d3.easeBounce)
                var vscale=d3.scaleLinear()
                        .domain([0,1000])
                        .range([height,0]);
                var hscale=d3.scaleBand()
                        .domain(d3.range(1,barData.length))
                        .range([1,width]);
                
                var vaxis=  d3.axisLeft()
                            .scale(vscale)
                            .ticks(5)
                            .tickPadding(5)
                 var haxis=  d3.axisBottom()
                            .scale(hscale)
                            .ticks(5)
                            .tickPadding(5)
                var vguide=this.canvas.append('g')
                    vaxis(vguide)
                vguide.attr('transform','translate(20,0)')
                 var hguide=this.canvas.append('g')
                    haxis(hguide)
               hguide.attr('transform','translate(20,'+height+')')
                }
        }
	   }
	ngAfterViewInit() {
		this.loadGraph();
	}

}