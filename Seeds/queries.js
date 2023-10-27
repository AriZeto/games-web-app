const queries = async (name) => {
  const gameQuery = `fields storyline, videos.video_id, screenshots.url, artworks, summary, rating, release_dates.y, name, involved_companies.company.name, cover.url, aggregated_rating; limit 500; where storyline != null & cover != null & name != null & involved_companies.company.name != null & aggregated_rating > 89 & rating > 89 & release_dates != null & summary != null & screenshots.url != null & name != "Mass Effect 2";`;

  const featuredQuery = `fields storyline, videos.video_id, screenshots.url, artworks, summary, rating, release_dates.y, name, involved_companies.company.name, cover.url, aggregated_rating; limit 500; where cover != null & name = "${name}" & involved_companies.company.name != null & release_dates != null & summary != null & screenshots.url != null;`;

  const charQuery = `fields name, mug_shot.url; limit 500; where mug_shot.url != null & name = "${name}";`;

  const queries = [gameQuery, featuredQuery, charQuery];
  return queries;
};

module.exports = queries;
