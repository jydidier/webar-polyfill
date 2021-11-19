var POS = POS || {};

POS.SquareFiducial = function(modelSize, focalLength, width, height){
  this.modelSize = modelSize || 70;
  this.focalLength = focalLength || 600;
  this.u0 = width/2.0;
  this.v0 = height/2.0;
  this.au = this.focalLength;
  this.av = this.focalLength;

  this.setModelSize = function (modelSize) {
    this.modelSize = modelSize;  
  };

  this.setFocalLength = function (focal) {
    this.focalLength = focal;
    this.au = focal;
    this.av = focal;      
  };
  
  this.setMatrix = function (mat) {
    this.au = mat[0];
    this.av = mat[4];
    this.u0 = mat[2];
    this.v0 = mat[5];
  };
  
  this.setImageSize = function (width, height) {
    this.u0 = width/2;
    this.v0 = height/2;
  };
  
};


POS.SquareFiducial.prototype.pose = function(imagePoints){
    let u0 = this.u0;
    let v0 = this.v0;
    let au = this.au;
    let av = this.av;

    let ua = imagePoints[0].x ;
    let va = imagePoints[0].y ;
    let ub = imagePoints[1].x ;
    let vb = imagePoints[1].y ;
    let uc = imagePoints[2].x ;
    let vc = imagePoints[2].y ;
    let ud = imagePoints[3].x ;
    let vd = imagePoints[3].y ;
    
    let detm = uc*vd - vc*ud + ud*vb - ub*vd + ub*vc - uc*vb;
    let ZA = 1;
    let ZB = (ua * (vc - vd) + va * (ud - uc) + (uc*vd - ud*vc))/detm ;
    let ZC = (ua * (vb - vd) + va * (ud - ub) - (ud*vb - ub*vd))/detm ;
    let ZD = (ua * (vb - vc) + va * (uc - ub) + (ub*vc - uc*vb))/detm ;
    let r1 = ZC/ZA ;
    let r2 = ZD/ZB ; //ZB/ZD ;
        
    let tmp11 = (r1*(ua - u0)-(uc -u0))/au ;
    let tmp12 = (r1*(va - v0)-(vc -v0))/av ;
    let tmp21 = (r2*(ub - u0)-(ud -u0))/au ;
    let tmp22 = (r2*(vb - v0)-(vd -v0))/av ;
        
    let ZpA = -this.modelSize*Math.sqrt(2) / Math.sqrt((r1-1)*(r1-1) + tmp11*tmp11 + tmp12*tmp12) ;
    let ZpB = -this.modelSize*Math.sqrt(2) / Math.sqrt((r2-1)*(r2-1) + tmp21*tmp21 + tmp22*tmp22) ;
    let ZpC = r1 * ZpA;
    let ZpD = r2 * ZpB;

    let XA = ZpA/au *(ua-u0);
    let XB = ZpB/au *(ub-u0);
    let XC = ZpC/au *(uc-u0);
    let XD = ZpD/au *(ud-u0);
    
    let YA = ZpA/av *(va-v0);
    let YB = ZpB/av *(vb-v0);
    let YC = ZpC/av *(vc-v0);
    let YD = ZpD/av *(vd-v0);
    
    let position = [];
    position[0] = -(XA + XB + XC + XD)/4.0;
    position[1] = (YA + YB + YC + YD)/4.0;
    position[2] = (ZpA + ZpB + ZpC + ZpD)/4.0;
    
    let AC = [ - XC + XA, YC - YA, ZpC - ZpA ];
    let DB = [ - XB + XD, YB - YD, ZpB - ZpD ];
    
    let AB = [ XB - XA, YB - YA, ZpB - ZpA ];
    let DA = [ XA - XD, YA - YD, ZpA - ZpD ];
    
    
    let sV = this.sumVectors(AC,DB);
    let dV = this.diffVectors(DB,AC);
    
    let xStar = this.scalVector(sV, 1.0/this.normVector(sV));
    let yStar = this.scalVector(dV, 1.0/this.normVector(dV));
    let zStar = this.crossProduct(xStar,yStar);
    let r3Star = this.scalVector(zStar,1.0/this.normVector(zStar));
    let xpStar = this.crossProduct(yStar,r3Star);
    let xppStar = this.sumVectors(xStar,xpStar);
    
    let r1Star = this.scalVector(xppStar,1.0/this.normVector(xppStar));
    let r2Star = this.crossProduct(r3Star,r1Star); 
    //console.log(zStar, r3Star);

    
    let rotation = [ 
        [ r1Star[0], r2Star[0], r3Star[0] ],
        [ r1Star[1], r2Star[1], r3Star[1] ],
        [ r1Star[2], r2Star[2], r3Star[2] ]        
    ];
    return new POS.SimplePose(position, rotation);
};

POS.SquareFiducial.prototype.sumVectors = function(a,b) {
  return [ a[0]+b[0], a[1]+b[1], a[2]+b[2] ];  
};

POS.SquareFiducial.prototype.diffVectors = function (a,b) {
  return [ a[0]-b[0], a[1]-b[1], a[2]-b[2] ];  
};

POS.SquareFiducial.prototype.scalVector = function(a,s) {
  return [ a[0]*s, a[1]*s, a[2]*s ];  
};

POS.SquareFiducial.prototype.normVector = function (a) {
  return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); 
};

POS.SquareFiducial.prototype.crossProduct = function(a,b) {
    return [ a[1]*b[2] - a[2]*b[1],
	     a[2]*b[0] - a[0]*b[2],
	     a[0]*b[1] - a[1]*b[0]    
	    ];  
};


POS.SimplePose = function(pos, rot) {
    this.position = pos;
    this.rotation = rot;
};

export default POS;
