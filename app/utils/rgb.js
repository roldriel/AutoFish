const Vec = require("./vec.js");

const isInLimits = ({x, y}, limits) => {
  return (x >= limits.x &&
          y >= limits.y &&
          x < limits.x + limits.width &&
          y < limits.y + limits.height);
};

module.exports = class Rgb {
  constructor(rgb, zone) {
    this.rgb = rgb;
    this.zone = zone;
  }

  colorAt({ x, y }) {
    if (isInLimits({x, y}, this.zone)) {
      return this.rgb[y][x];
    } else {
      return [0, 0, 0];
    }
  }

  findColors(isColor, firstMet) {
    let colors = [];
    for (let y = this.zone.y; y < this.zone.y + this.zone.height; y++) {
      for (let x = this.zone.x; x < this.zone.x + this.zone.width; x++) {
        let pos = new Vec(x, y);
        let color = this.colorAt(pos);
        if (isColor(color)) {
          if(firstMet) {
            return {pos, color};
          }
          colors.push({pos, color})
        }
      }
    }
    return colors.length > 1 ? colors : null;
  }

  cutOut(except) {
    except.forEach(exception => {
      if(isInLimits(exception, this.zone)) {
        this.rgb[exception.y][exception.x] = [0, 0, 0];
      }
    });
    return new Rgb(this.rgb, this.zone);
  }

  static from(data, zone) {
    let rgb = [];
    for (let y = 0, i = 0; y < zone.height; y++) {
      let row = [];
      for (let x = 0; x < zone.width; x++, i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        row[zone.x + x] = [r, g, b];
      }
      rgb[zone.y + y] = row;
    }

    return new Rgb(rgb, zone);
  }
};
