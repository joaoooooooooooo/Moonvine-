// Local landing-page sample; page visits add up to the selected week's total.
export function analyticsTopPages(total) {
  const paths = ['/jobs/designer', '/', '/services', '/about', '/contact'];
  const shares = [50, 20, 15, 10, 5];
  const previews = ['/report-media/apta-0.jpg', '/report-media/apta-3.jpg', '/report-media/apta-7.jpg', '/report-media/apta-3.jpg', '/report-media/apta-0.jpg'];
  let allocated = 0;
  return paths.map((path, index) => {
    const visits = index === paths.length - 1 ? total - allocated : Math.floor(total * shares[index] / 100);
    allocated += visits;
    return { path, visits, share: total ? visits / total * 100 : 0, preview: previews[index] };
  });
}
