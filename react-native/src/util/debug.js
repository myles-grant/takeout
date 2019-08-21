export default {

  layoutColor(debug, color, index)
  {
    if(!debug) {
      return (color.length > 0 ? color : 'transparent');
    }

    let colors = [
      'red',
      'blue',
      'green',
      'pink',
      'purple',
      'yellow',
      'brown',
      'black',
      'grey',
      'orange'
    ];

    return colors[index];
  }
};
