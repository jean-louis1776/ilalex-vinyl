export interface VinylListArray {
  id: number
  name: string
  artist: string
  price: number
  link: string
  image: string
  important?: boolean
  original?: number 
  repress?: number
  sealed?: boolean
}

export const VinylList: VinylListArray[] = [
  {
    id: 1,
    name: "The Man I Love (UK), 1984",
    artist: "Peggy Lee",
    price: 2431,
    link: "https://vinylpark.ru/catalog/peggy_lee/lee_the_man_i_love/peggy_lee_the_man_i_love_uk_1984_18357/",
    image:
      "https://vinylpark.ru/upload/iblock/88c/88c93c918ac3c84fa42f38563f7bedc6.jpg",
    important: true,
    original: 1984,
  },
  {
    id: 2,
    name: "Out Of Control, 1988",
    artist: "Dynasty",
    price: 689,
    link: "https://vinylpark.ru/catalog/dynasty/dynasty_out_of_control/dynasty_out_of_contril_1988_128/",
    image:
      "https://vinylpark.ru/upload/iblock/2cd/2cd83b9b61bc7f6fb98bb60c684a4503.jpg",
    important: true,
    original: 1988,
  },
  {
    id: 3,
    name: "Tom Cochrane And Red Rider, 1986",
    artist: "Tom Cochrane And Red Rider",
    price: 842,
    link: "https://vinylpark.ru/catalog/tom_cochrane_red_rider/cochrane_red_rider_tom_cochrane_and_red_rider/tom_cochrane_and_red_rider_tom_cochrane_and_red_rider_1986/",
    image:
      "https://vinylpark.ru/upload/iblock/040/0405e9451026e396ce0a8ad6a5079592.jpg",
    important: true,
    original: 1986,
  },
  {
    id: 4,
    name: "Rain On (USA), 1976",
    artist: "Gene Cotton",
    price: 927,
    link: "https://vinylpark.ru/catalog/gene_cotton/cotton_rain_on/gene_cotton_rain_on_usa_1976/",
    image:
      "https://vinylpark.ru/upload/iblock/f55/f556a87c98d6598eb4ad79674aabec94.jpg",
    important: true,
    original: 1976,
  },
  {
    id: 5,
    name: "Calling In The Lions, 1986",
    artist: "Venetians",
    price: 833,
    link: "https://vinylpark.ru/catalog/venetians/calling_in_the_lions/venetians_calling_in_the_lions_1986/",
    image:
      "https://vinylpark.ru/upload/iblock/6a4/6a4ee515dce56385a152936844f6751a.jpg",
    important: true,
    original: 1986,
  },
  {
    id: 6,
    name: "Troubles & Trials, 1985",
    artist: "Patent Pending",
    price: 757,
    link: "https://vinylpark.ru/catalog/patent_pending/pending_troubles_and_trials/patent_pending_troubles_trials_1985/",
    image:
      "https://vinylpark.ru/upload/iblock/9fe/9fecb5c085e5b0134a3c4f9b71320fe5.jpg",
    important: true,
    original: 1985,
  },
  {
    id: 7,
    name: "Scissors Cut, 1981",
    artist: "Art Garfunkel",
    price: 901,
    link: "https://vinylpark.ru/catalog/art_garfunkel/garfunkel_scissors_cut/art_garfunkel_scissors_cut_1981_1/",
    image:
      "https://vinylpark.ru/upload/iblock/927/9275442bf0551aaab2cc06898ef2e1ae.jpg",
    important: true,
    original: 1981,
  },
  {
    id: 8,
    name: "Royal Tea (2LP+CD, Box-set), 2020",
    artist: "Joe Bonamassa",
    price: 7992,
    link: "https://vinylpark.ru/catalog/joe_bonamassa/bonamassa_royal_tea/joe_bonamassa_royal_tea_2lp_cd_box_set_2020_28852/",
    image:
      "https://vinylpark.ru/upload/iblock/85a/38fk8kp6vcffzjpw9mk3mint2lfm0316.jpg",
    original: 2020,
    sealed: true,
  },
  {
    id: 9,
    name: "Map Of The Past (2LP+CD), 2012",
    artist: "It Bites",
    price: 4401,
    link: "https://vinylpark.ru/catalog/it_bites/bites_map_of_the_past/it_bites_map_of_the_past_2lp_cd_2012_17746/",
    image:
      "https://vinylpark.ru/upload/iblock/c3a/c3a68f69fcf5d3e7db00b70525cadc13.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 10,
    name: "Some Like It Hot (Original Music From The Motion Picture Sound Track), 1959",
    artist: "Various",
    price: 5423,
    link: "https://vinylpark.ru/catalog/marilyn_monroe/some_like_it_hot/various_some_like_it_hot_original_music_from_the_motion_picture_sound_track_40772/",
    image:
      "https://vinylpark.ru/upload/iblock/ce0/r3z9is6nq5rnqah628qdj3ulm8k1rdkm.jpg",
    repress: 1975,
  },
  {
    id: 11,
    name: "The Man•Machine, 1978",
    artist: "Kraftwerk",
    price: 5112,
    link: "https://vinylpark.ru/catalog/kraftwerk/kraftwerk_the_man_machine_1978_17487/",
    image:
      "https://vinylpark.ru/upload/iblock/3fa/3fa2115b6dcc42e3c8c8062704edcdfd.jpg",
    repress: 2015,
    sealed: true,
  },
  {
    id: 12,
    name: "Ace Of Spades, 1980",
    artist: "Motörhead",
    price: 4491,
    link: "https://vinylpark.ru/catalog/motorhead/ace_of_spades/mot_rhead_ace_of_spades_1980_18892/",
    image:
      "https://vinylpark.ru/upload/iblock/7fd/7fdd70d36a2a51f7d4bd3058ac5a9d9d.jpg",
    repress: 2015,
    sealed: true,
  },
  {
    id: 13,
    name: "Violator, 1991",
    artist: "Depeche Mode",
    price: 6282,
    link: "https://vinylpark.ru/catalog/depeche_mode/mode_violator/depeche_mode_violator_1991_40830/",
    image:
      "https://vinylpark.ru/upload/iblock/84e/ye3o7pynb5b32wcfijpnb206goa0j6gq.jpg",
    repress: 2016,
    sealed: true,
  },
  {
    id: 14,
    name: "Out Of Time, 1991",
    artist: "R.E.M.",
    price: 4482,
    link: "https://vinylpark.ru/catalog/rem/out_of_time/r_e_m_out_of_time_1991_26337/",
    image:
      "https://vinylpark.ru/upload/iblock/070/pyhzw5kg8gjmu53alt1ltgt9xwvlr861.jpg",
    repress: 2016,
    sealed: true,
  },
  {
    id: 15,
    name: "Greatest Hits (2LP), 2005",
    artist: "Blink-182",
    price: 5832,
    link: "https://vinylpark.ru/catalog/blink_182/blink_182_greatest_hits_2lp_2005_21473/",
    image:
      "https://vinylpark.ru/upload/iblock/b5c/b5cb1d685f467daac5c34527a23d6a72.jpg",
    repress: 2022,
    sealed: true,
  },
  {
    id: 16,
    name: "The Very Best Of, 2020",
    artist: "Ella Fitzgerald",
    price: 4401,
    link: "https://vinylpark.ru/catalog/ella_fitzgerald/ella_fitzgerald_the_very_best_of_2020_27581/",
    image:
      "https://vinylpark.ru/upload/iblock/fd0/te1yyg09xaq5i1ih4fxw9xszpvadjzb1.jpg",
    original: 2020,
    sealed: true,
  },
  {
    id: 17,
    name: "I Love You So, 1959",
    artist: "B.B. King",
    price: 4032,
    link: "https://vinylpark.ru/catalog/bb_king/b_b_king_i_love_you_so_1959_38044/",
    image:
      "https://vinylpark.ru/upload/iblock/72e/hem3xa5a8wdjzomv3xn3i8kxdco1drvg.jpg",
    repress: 2017,
    sealed: true,
  },
  {
    id: 18,
    name: "50s & 60s Country & Western Hits vol. 1, 2024",
    artist: "Various",
    price: 4302,
    link: "https://vinylpark.ru/catalog/various/sborniki_various/various_50s_60s_country_western_hits_vol_1_2024_33994/",
    image:
      "https://vinylpark.ru/upload/iblock/4a5/xbqwbi0ep73lmondh7br9kafw85xnxcb.jpg",
    original: 2024,
    sealed: true,
  },
  {
    id: 19,
    name: "Frank Sinatra's Greatest Hits, 1968",
    artist: "Frank Sinatra",
    price: 3978,
    link: "https://vinylpark.ru/catalog/frank_sinatra/sborniki__frank_sinatra/frank_sinatra_frank_sinatra_s_greatest_hits_1968_40721/",
    image:
      "https://vinylpark.ru/upload/iblock/a50/v5lw1wydmxhuvmj1jb5xp027ig5rc4rt.jpg",
    repress: 1971,
  },
  {
    id: 20,
    name: "Every Breath You Take (The Singles) (USA), 1986",
    artist: "Police",
    price: 7973,
    link: "https://vinylpark.ru/catalog/police/police_every_breath_you_take_the_singles_usa_1986_40338/",
    image:
      "https://vinylpark.ru/upload/iblock/193/xeogg3lpcqgjssjd1u40saotb26w60dd.jpg",
    original: 1986,
  },
  {
    id: 21,
    name: "Greatest Hits, 2018",
    artist: "Chuck Berry",
    price: 4032,
    link: "https://vinylpark.ru/catalog/chuck_berry/chuck_berry_greatest_hits_2018_35635/",
    image:
      "https://vinylpark.ru/upload/iblock/507/fx8krl27lzvcwk3vqvukveqsuqrx5n03.jpg",
    original: 2018,
    sealed: true,
  },
  {
    id: 22,
    name: "I Wanna Be Loved By You, 2016",
    artist: "Marilyn Monroe",
    price: 4032,
    link: "https://vinylpark.ru/catalog/marilyn_monroe/monroe_i_wanna_be_loved_by_you/marilyn_monroe_i_wanna_be_loved_by_you_2016_31351/",
    image:
      "https://vinylpark.ru/upload/iblock/e96/ox11f1kxxf59l8f6270m02vohrsb7q6n.jpg",
    important: true,
    repress: 2019,
    sealed: true,
  },
  {
    id: 23,
    name: "Sing Country & Western Classics, 2018",
    artist: "Dean Martin & Frank Sinatra",
    price: 4482,
    link: "https://vinylpark.ru/catalog/dean_martin/dean_martin_frank_sinatra_sing_country_western_classics_2018_26832/",
    image:
      "https://vinylpark.ru/upload/iblock/914/t3kofsqicvp2r350m6p4m4v3j0jt86lq.jpg",
    original: 2018,
    sealed: true,
  },
  {
    id: 24,
    name: "Ultimate, 2020",
    artist: "Frank Sinatra",
    price: 4032,
    link: "https://vinylpark.ru/catalog/frank_sinatra/sborniki__frank_sinatra/frank_sinatra_ultimate_2020_40472/",
    image:
      "https://vinylpark.ru/upload/iblock/582/g4i32amgjehs8ue3tdai9iolq1uc06r0.jpg",
    important: true,
    original: 2020,
    sealed: true,
  },
  {
    id: 25,
    name: "Simulation Theory, 2018",
    artist: "Muse",
    price: 3852,
    link: "https://vinylpark.ru/catalog/muse/simulation_theory/muse_simulation_theory_2018_14431/",
    image:
      "https://vinylpark.ru/upload/iblock/6bb/6bba28f47d76e74f22c43824686c5913.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 26,
    name: "The Number One Hits 1956-1962, 2015",
    artist: "Elvis Presley",
    price: 3852,
    link: "https://vinylpark.ru/catalog/elvis_presley/sborniki_elvis_presley/elvis_presley_the_number_one_hits_1956_1962_2015_30582/",
    image:
      "https://vinylpark.ru/upload/iblock/ea9/wwi8yxtej0w11aep7eg0e9qbxx5i3fo0.jpg",
    important: true,
    original: 2015,
    sealed: true,
  },
  {
    id: 27,
    name: 'Gold (LP+7", 1979',
    artist: "Jefferson Starship",
    price: 3591,
    link: "https://vinylpark.ru/catalog/jefferson_starship/starship_gold/jefferson_starship_gold_2019/",
    image:
      "https://vinylpark.ru/upload/iblock/9ef/9efa4ca2901d28e0defd9bdcdbba0386.jpg",
    important: true,
    repress: 2019,
    sealed: true,
  },
  {
    id: 28,
    name: "Headlines And Deadlines - The Hits Of A-Ha, 1991",
    artist: "a-ha",
    price: 4752,
    link: "https://vinylpark.ru/catalog/a_ha/ha_headlines_and_deadlines_the_hits_of_a_ha/a_ha_headlines_and_deadlines_the_hits_of_a_ha_1991_26386/",
    image:
      "https://vinylpark.ru/upload/iblock/050/u0hsg1btds6nqewwa0o33l6td6ndczf1.jpg",
    repress: 2018,
    sealed: true,
  },
  {
    id: 29,
    name: "Relics, 1971",
    artist: "Pink Floyd",
    price: 4752,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_relics/pink_floyd_relics_2018_1/",
    image:
      "https://vinylpark.ru/upload/iblock/c86/c86a9a2558d8d0d2824825c33e57bd38.jpg",
    repress: 2018,
    sealed: true,
  },
  {
    id: 30,
    name: "Meteora, 2003",
    artist: "Linkin Park",
    price: 6012,
    link: "https://vinylpark.ru/catalog/linkin_park/linkin_park_meteora_2003_40479/",
    image:
      "https://vinylpark.ru/upload/iblock/d48/67zgjqivdn35mvpteslvzc4n4m2up15s.jpg",
    repress: 2023,
    sealed: true,
  },
  {
    id: 31,
    name: "Hybrid Theory, 2000",
    artist: "Linkin Park",
    price: 5382,
    link: "https://vinylpark.ru/catalog/linkin_park/linkin_park_hybrid_theory_2000_38283/",
    image:
      "https://vinylpark.ru/upload/iblock/d24/ewsp87j9javxex29rj401gljr4su0lae.jpg",
    repress: 2020,
    sealed: true,
  },
  {
    id: 32,
    name: "Untitled, 1971",
    artist: "Led Zeppelin",
    price: 5202,
    link: "https://vinylpark.ru/catalog/led_zeppelin/untitled_led_zeppelin_iv/led_zeppelin_untitled_1971_38244/",
    image:
      "https://vinylpark.ru/upload/iblock/471/8u5heqshg9thm7smz714fl60v9a1f3nq.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 33,
    name: "AM, 2013",
    artist: "Arctic Monkeys",
    price: 5382,
    link: "https://vinylpark.ru/catalog/arctic_monkeys/arctic_monkeys_am_2013_38128/",
    image:
      "https://vinylpark.ru/upload/iblock/e18/tm3z7e3xjp401ut5v4bxih7c73xpiddx.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 34,
    name: "The Classics (2LP), 2017",
    artist: "Hans Zimmer",
    price: 6282,
    link: "https://vinylpark.ru/catalog/hans_zimmer/hans_zimmer_the_classics_2lp_2017_40640/",
    image:
      "https://vinylpark.ru/upload/iblock/f9d/h9j109pfnhx6073a1hlqxl40febhoeig.jpg",
    original: 2017,
    sealed: true,
  },
  {
    id: 35,
    name: "Janis Joplin's Greatest Hits, 1973",
    artist: "Janis Joplin",
    price: 3392,
    link: "https://vinylpark.ru/catalog/janis_joplin/sborniki_janis_joplin/janis_joplin_janis_joplin_s_greatest_hits_1973_22463/",
    image:
      "https://vinylpark.ru/upload/iblock/c24/c24871ac234bccf3bb67e1946ec7d720.jpg",
    repress: 1987,
  },
  {
    id: 36,
    name: "Always Patsy Cline (1-st, USA), 1980",
    artist: "Patsy Cline",
    price: 3391,
    link: "https://vinylpark.ru/catalog/patsy_cline/sborniki_patsy_cline/patsy_cline_always_patsy_cline_1_st_usa_1980_37808/",
    image:
      "https://vinylpark.ru/upload/iblock/5a1/02dvidvpxs3ugwuzm3j73q2w3owyhd3y.jpg",
    original: 1980,
  },
  {
    id: 37,
    name: "Shapeshifting, 2020",
    artist: "Joe Satriani",
    price: 3582,
    link: "https://vinylpark.ru/catalog/joe_satriani/satriani_shapeshifting/joe_satriani_shapeshifting_2020/",
    image:
      "https://vinylpark.ru/upload/iblock/b9b/b9b39afe076cddce2a600058f5d09da2.jpg",
    original: 2020,
    sealed: true,
  },
  {
    id: 38,
    name: "1984, 1984",
    artist: "Van Halen",
    price: 3582,
    link: "https://vinylpark.ru/catalog/van_halen/halen_1984/van_halen_1984_2019/",
    image:
      "https://vinylpark.ru/upload/iblock/891/8913169fdb3bd2409c7b0a458c1a48aa.jpg",
    repress: 2019,
    sealed: true,
  },
  {
    id: 39,
    name: "Bing And The Andrews Sisters (2LP, UK), 1975",
    artist: "Bing Crosby, The Andrews Sisters",
    price: 3383,
    link: "https://vinylpark.ru/catalog/bing_crosby/bing_crosby_the_andrews_sisters_bing_and_the_andrews_sisters_2lp_uk_1975_35362/",
    image:
      "https://vinylpark.ru/upload/iblock/ea3/79fpmbrlh02vyeoadgsfkvzfjd0j13eb.jpg",
    original: 1975,
  },
  {
    id: 40,
    name: "Play (2LP), 1999",
    artist: "Moby",
    price: 5382,
    link: "https://vinylpark.ru/catalog/moby/play/moby_play_2lp_1999_32260/",
    image:
      "https://vinylpark.ru/upload/iblock/55e/sigg1uslikrf0g524gktj0m7fu50t97j.jpg",
    repress: 2022,
    sealed: true,
  },
  {
    id: 41,
    name: "Satisfaction, 1979",
    artist: "Rolling Stones",
    price: 3281,
    link: "https://vinylpark.ru/catalog/rolling_stones/sborniki_rolling_stones/rolling_stones_satisfaction_1979_22556/",
    image:
      "https://vinylpark.ru/upload/iblock/b3c/b3c3f6fb884fd4ae456717b8db50a3da.jpg",
    original: 1979,
  },
  {
    id: 42,
    name: "Private Investigations (The Best Of) (2LP), 2005",
    artist: "Dire Straits & Mark Knopfler",
    price: 7992,
    link: "https://vinylpark.ru/catalog/dire_straits/sborniki__dire_straits/dire_straits_mark_knopfler_private_investigations_the_best_of_2lp_2005_40683/",
    image:
      "https://vinylpark.ru/upload/iblock/07c/f4nnifw0z28kisq7de6pec2kz33viboe.jpg",
    repress: 2022,
    sealed: true,
  },
  {
    id: 43,
    name: "Stay On These Roads, 1988",
    artist: "a-ha",
    price: 4233,
    link: "https://vinylpark.ru/catalog/a_ha/a_ha_stay_on_these_roads_1988_28062/",
    image:
      "https://vinylpark.ru/upload/iblock/075/xe6yz27k5mu44ft8gmrujueorrqaqoc2.jpg",
    original: 1988,
  },
  {
    id: 44,
    name: "Minor Earth | Major Sky (2LP), 2000",
    artist: "a-ha",
    price: 6732,
    link: "https://vinylpark.ru/catalog/a_ha/a_ha_minor_earth_major_sky_2lp_2000_23499/",
    image:
      "https://vinylpark.ru/upload/iblock/06d/icjl876kxovclcinnvdd3f2hblxxhnrj.jpg",
    repress: 2019,
    sealed: true,
  },
  {
    id: 45,
    name: "Hunting High And Low, 1985",
    artist: "a-ha",
    price: 4233,
    link: "https://vinylpark.ru/catalog/a_ha/ha_hunting_high_and_low/a_ha_hunting_high_and_low_1985_34892/",
    image:
      "https://vinylpark.ru/upload/iblock/b70/ly5w0r8zp6i446wjny050m0pll0773hv.jpg",
    original: 1985,
  },
  {
    id: 46,
    name: "Lifelines (2LP), 2002",
    artist: "a-ha",
    price: 7542,
    link: "https://vinylpark.ru/catalog/a_ha/a_ha_lifelines_2lp_2002_34533/",
    image:
      "https://vinylpark.ru/upload/iblock/314/lcs0kymlhnlf97tusjzclu2qiejrdi60.jpg",
    repress: 2019,
    sealed: true,
  },
  {
    id: 47,
    name: "Scoundrel Days, 1986",
    artist: "a-ha",
    price: 3128,
    link: "https://vinylpark.ru/catalog/a_ha/ha_scoundrel_days/a_ha_scoundrel_days_1986_23052/",
    image:
      "https://vinylpark.ru/upload/iblock/472/47293ac420becbdec4117c501fb4c447.jpg",
    original: 1986,
  },
  {
    id: 48,
    name: "Abbey Road, 1969",
    artist: "Beatles",
    price: 6282,
    link: "https://vinylpark.ru/catalog/beatles/beatles_abbey_road_1969_38011/",
    image:
      "https://vinylpark.ru/upload/iblock/881/zys2j9dgv4osvrb2ybeghgwxa8gogsot.jpg",
    repress: 2019,
    sealed: true,
  },
  {
    id: 49,
    name: "1967-1970 (2LP), 1973",
    artist: "Beatles",
    price: 4487,
    link: "https://vinylpark.ru/catalog/beatles/beatles_1967_1970_2lp_1973_36101/",
    image:
      "https://vinylpark.ru/upload/iblock/74b/8fb0kxwwlh8h8ue2aoh9axoocizrhof3.jpg",
    original: 1973,
  },
  {
    id: 50,
    name: "1962-1966 (2LP), 1973",
    artist: "Beatles",
    price: 4215,
    link: "https://vinylpark.ru/catalog/beatles/beatles_1962_1966_2lp_1973_35925/",
    image:
      "https://vinylpark.ru/upload/iblock/105/n7x0tylsmv8bym869x1rljtm8v1wl9rz.jpg",
    original: 1973,
  },
  {
    id: 51,
    name: "Voyage Voyage, 1986",
    artist: "Desireless",
    price: 2967,
    link: "https://vinylpark.ru/catalog/desireless/fran%C3%A7ois_voyage_voyage/desireless_voyage_voyage_1986_28883/",
    image:
      "https://vinylpark.ru/upload/iblock/a10/m1eevu5attuezf7l1hm9g806e8p5piyz.jpg",
    repress: 2023,
  },
  {
    id: 52,
    name: "Voyage, 2021",
    artist: "ABBA",
    price: 4482,
    link: "https://vinylpark.ru/catalog/abba/abba_voyage/abba_voyage_2021_29908/",
    image:
      "https://vinylpark.ru/upload/iblock/63a/oenw4xs819cabqj0kn0fm6ykpw481c00.jpg",
    original: 2021,
    sealed: true,
  },
  {
    id: 53,
    name: "Gold (Greatest Hits) (2LP), 1992",
    artist: "ABBA",
    price: 8082,
    link: "https://vinylpark.ru/catalog/abba/sborniki_abba/abba_gold_greatest_hits_2lp_1992_40845/",
    image:
      "https://vinylpark.ru/upload/iblock/702/o2g4pu362irbmbyoqyyanz42koh2tnha.jpg",
    repress: 2024,
    sealed: true,
  },
  {
    id: 54,
    name: "Oxygène (France), 1976",
    artist: "Jean Michel Jarre",
    price: 4233,
    link: "https://vinylpark.ru/catalog/jean_michel_jarre/jean_michel_jarre_oxyg_ne_france_1976_33238/",
    image:
      "https://vinylpark.ru/upload/iblock/8f7/qg5w0oj0dnm6y5iiv65zlddp21xb7oyn.jpg",
    repress: 1983,
  },
  {
    id: 55,
    name: "Equinoxe (France), 1978",
    artist: "Jean Michel Jarre",
    price: 3383,
    link: "https://vinylpark.ru/catalog/jean_michel_jarre/jean_michel_jarre_equinoxe_france_1978_32373/",
    image:
      "https://vinylpark.ru/upload/iblock/bf0/2032t94mz2hfs76kchry6ya6vyxtxk4s.jpg",
    original: 1978,
  },
  {
    id: 56,
    name: 'Arnold Layne (7"), 2020',
    artist: "Pink Floyd",
    price: 2952,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_arnold_layne/pink_floyd_arnold_layne_7_2020_27266/",
    image:
      "https://vinylpark.ru/upload/iblock/99c/v8dgbvz756n1d7abxoddjs7achqem24j.jpg",
    original: 2020,
    sealed: true,
  },
  {
    id: 57,
    name: "L.A. Woman, 1971",
    artist: "Doors",
    price: 4482,
    link: "https://vinylpark.ru/catalog/doors/doors_l_a_woman_1971_36187/",
    image:
      "https://vinylpark.ru/upload/iblock/869/x9hzu41ulk60h2xf2j0oesxys1clv59a.jpg",
    repress: 2020,
    sealed: true,
  },
  {
    id: 58,
    name: "Whisky In The Jar (UK), 1986",
    artist: "Thin Lizzy",
    price: 2542,
    link: "https://vinylpark.ru/catalog/thin_lizzy/sborniki_thin_lizzy/thin_lizzy_whisky_in_the_jar_uk_1986_13364/",
    image:
      "https://vinylpark.ru/upload/iblock/fdd/fdd2c1218674fa181e331a45967d0df2.jpg",
    original: 1986,
  },
  {
    id: 59,
    name: "Doin' Just Fine (USA), 1982",
    artist: "Jerry Lee Lewis",
    price: 2691,
    link: "https://vinylpark.ru/catalog/jerry_lee_lewis/lee_lewis_doin_just_fine/jerry_lee_lewis_doin_just_fine_usa_1982_16478/",
    image:
      "https://vinylpark.ru/upload/iblock/f43/f439e017db29070d360d97bbef07e267.jpg",
    original: 1982,
    sealed: true,
  },
  {
    id: 60,
    name: "3rd Degree, 1986",
    artist: "Johnny Winter",
    price: 2542,
    link: "https://vinylpark.ru/catalog/johnny_winter/winter_3rd_degree/johnny_winter_3rd_degree_1986_25070/",
    image:
      "https://vinylpark.ru/upload/iblock/e27/g9hnzt2uin9fnc81f9zsblnq3k2xom5a.jpg",
    original: 1986,
  },
  {
    id: 61,
    name: "Paranoid, 1970",
    artist: "Black Sabbath",
    price: 7632,
    link: "https://vinylpark.ru/catalog/black_sabbath/sabbath_paranoid/black_sabbath_paranoid_1970_39071/",
    image:
      "https://vinylpark.ru/upload/iblock/154/aolakzoh0sztxgnr585al4cbanik6s21.jpg",
    repress: 2024,
    sealed: true,
  },
  {
    id: 62,
    name: "Comeblack (2LP), 2011",
    artist: "Scorpions",
    price: 5382,
    link: "https://vinylpark.ru/catalog/scorpions/scorpions_comeblack_2lp_2011_27858/",
    image:
      "https://vinylpark.ru/upload/iblock/3e7/8re5k48tbd1czlb5ttysd98m1v5l5m3t.jpg",
    original: 2011,
    sealed: true,
  },
  {
    id: 63,
    name: "Sinatra's Swingin' Session! (UK), 1961",
    artist: "Frank Sinatra",
    price: 2533,
    link: "https://vinylpark.ru/catalog/frank_sinatra/sinatra_sinatras_swingin_session/frank_sinatra_sinatra_s_swingin_session_uk_1984_27815/",
    image:
      "https://vinylpark.ru/upload/iblock/628/kox2o26q6c0q78nm5ejkzrp0njgyrwe5.jpg",
    repress: 1984,
  },
  {
    id: 64,
    name: "Frank Sinatra & The Count Basie Orchestra, 2017",
    artist: "Sinatra - Basie",
    price: 4032,
    link: "https://vinylpark.ru/catalog/frank_sinatra/sinatra_basie_frank_sinatra_the_count_basie_orchestra_2017_38063/",
    image:
      "https://vinylpark.ru/upload/iblock/404/rtelkxaoi6qd38lp8fhev7eny624y6z5.jpg",
    original: 2017,
    sealed: true,
  },
  {
    id: 65,
    name: "The Great American Songbook (The Standards Bob Sang) (2LP), 2017",
    artist: "Frank Sinatra",
    price: 5742,
    link: "https://vinylpark.ru/catalog/frank_sinatra/frank_sinatra_the_great_american_songbook_the_standards_bob_sang_2lp_2017_34734/",
    image:
      "https://vinylpark.ru/upload/iblock/ec5/3pzwykp31wmg1k7k7k9n815b44o6hcpj.jpg",
    repress: 2024,
    sealed: true,
  },
  {
    id: 66,
    name: "The World Starts Tonight (1-st, UK), 1977",
    artist: "Bonnie Tyler",
    price: 2533,
    link: "https://vinylpark.ru/catalog/bonnie_tyler/tyler_the_world_starts_tonight/bonnie_tyler_the_world_starts_tonight_1_st_uk_1977_35158/",
    image:
      "https://vinylpark.ru/upload/iblock/da2/8iidc67x290spjhecpdg16prcufpdgtb.jpg",
    original: 1977,
  },
  {
    id: 67,
    name: "Wicked Game, 1991",
    artist: "Chris Isaak",
    price: 7182,
    link: "https://vinylpark.ru/catalog/chris_isaak/chris_isaak_wicked_game_1991_39408/",
    image:
      "https://vinylpark.ru/upload/iblock/ee1/wpvvev6mhqnfq6lb655iq1c7uune6tbi.jpg",
    repress: 2025,
    sealed: true,
  },
  {
    id: 68,
    name: "Rumours, 1977",
    artist: "Fleetwood Mac",
    price: 4032,
    link: "https://vinylpark.ru/catalog/fleetwood_mac/mac_rumours/fleetwood_mac_rumours_1977_17177/",
    image:
      "https://vinylpark.ru/upload/iblock/9d7/9d7048ffedf6b2618d9ce421cb8c01b7.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 69,
    name: "Cats Without Claws, 1984",
    artist: "Donna Summer",
    price: 2023,
    link: "https://vinylpark.ru/catalog/donna_summer/summer_cats_without_claws/donna_summer_cats_without_claws_1984_33299/",
    image:
      "https://vinylpark.ru/upload/iblock/718/t6lje0kcn534yketr07265gdj5kxkz64.jpg",
    original: 1984,
  },
  {
    id: 70,
    name: "1987 (2LP), 1987",
    artist: "Whitesnake",
    price: 6282,
    link: "https://vinylpark.ru/catalog/whitesnake/whitesnake_1987/whitesnake_1987_2lp_1987_21010/",
    image:
      "https://vinylpark.ru/upload/iblock/2c4/2c4883033bbd2dfb44befc789be29a80.jpg",
    important: true,
    repress: 2017,
    sealed: true,
  },
  {
    id: 71,
    name: "Hallo Marlene, 1979",
    artist: "Marlene Dietrich",
    price: 2372,
    link: "https://vinylpark.ru/catalog/marlene_dietrich/hallo_marlene/marlene_dietrich_hallo_marlene_1979_39798/",
    image:
      "https://vinylpark.ru/upload/iblock/cdf/qztp1jsn01s7bwctg1wpjq1dqd3hs72q.jpg",
    original: 1979,
  },
  {
    id: 72,
    name: "Gaudi, 1987",
    artist: "The Alan Parsons Project",
    price: 2958,
    link: "https://vinylpark.ru/catalog/alan_parsons_project/parsons_project_gaudi/the_alan_parsons_project_gaudi_1987_33154/",
    image:
      "https://vinylpark.ru/upload/iblock/869/421xllles2aoximnivok6y4eqjrzkjbx.jpg",
    original: 1987,
  },
  {
    id: 73,
    name: "Stop!, 1988",
    artist: "Sam Brown",
    price: 2363,
    link: "https://vinylpark.ru/catalog/sam_brown/brown_stop/sam_brown_stop_1988_35352/",
    image:
      "https://vinylpark.ru/upload/iblock/6b6/jmj7oqut8t3gzt4rm0rf04ofw17tbmed.jpg",
    original: 1988,
  },
  {
    id: 74,
    name: "Astra, 1985",
    artist: "Asia",
    price: 3119,
    link: "https://vinylpark.ru/catalog/asia/asia_astra_1985_39452/",
    image:
      "https://vinylpark.ru/upload/iblock/dcb/96q3e9japq6jroatm1w48g11np231a4f.jpg",
    original: 1985,
  },
  {
    id: 75,
    name: "Alpha, 1983",
    artist: "Asia",
    price: 6902,
    link: "https://vinylpark.ru/catalog/asia/asia_alpha/asia_alpha_1983_40920/",
    image:
      "https://vinylpark.ru/upload/iblock/b6b/1cfcnyz0czjl27jxu3pmts4ckkyd71yd.jpg",
    original: 1983,
    sealed: true,
  },
  {
    id: 76,
    name: "Asia, 1982",
    artist: "Asia",
    price: 2286,
    link: "https://vinylpark.ru/catalog/asia/asia_asia_1982_38738/",
    image:
      "https://vinylpark.ru/upload/iblock/a34/5rgliot0tq4pt23jgz5ok8zsdxs2weu4.jpg",
    original: 1982,
  },
  {
    id: 77,
    name: "Hello, I'm Johnny Cash, 1970",
    artist: "Johnny Cash",
    price: 1683,
    link: "https://vinylpark.ru/catalog/johnny_cash/johnny_cash_hello_i_m_johnny_cash_1970/",
    image:
      "https://vinylpark.ru/upload/iblock/9a5/9a5bcd3371935eeb3c6b039fad069bf3.jpg",
    important: true,
    original: 1970,
  },
  {
    id: 78,
    name: "Iron Man 2 (2LP), 2010",
    artist: "AC/DC",
    price: 6282,
    link: "https://vinylpark.ru/catalog/ac_dc/acdc_iron_man_2/ac_dc_iron_man_2_2lp_2010_39684/",
    image:
      "https://vinylpark.ru/upload/iblock/9e3/ak50vezau3jseb1p8ffqsa6vjjryc1oj.jpg",
    original: 2010,
    sealed: true,
  },
  {
    id: 79,
    name: "Meddle, 1971",
    artist: "Pink Floyd",
    price: 5112,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_meddle/pink_floyd_meddle_1971_31697/",
    image:
      "https://vinylpark.ru/upload/iblock/ee8/gba1v13e6yy5n2ljp0ih1aliwq3dnq5i.jpg",
    repress: 2016,
    sealed: true,
  },
  {
    id: 80,
    name: "Obscured By Clouds (Music From La Vallée), 1972",
    artist: "Pink Floyd",
    price: 5112,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_obscured_by_clouds/pink_floyd_obscured_by_clouds_music_from_la_vall_e_1972_16186/",
    image:
      "https://vinylpark.ru/upload/iblock/529/5291dd72c51ccae06c5902fffa2d98b2.jpg",
    repress: 2018,
    sealed: true,
  },
  {
    id: 81,
    name: "Animals (2018 Remix), 1977",
    artist: "Pink Floyd",
    price: 5382,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_animals/pink_floyd_animals_2018_remix_1977_21861/",
    image:
      "https://vinylpark.ru/upload/iblock/fe6/fe6c639a7d4ac6479d7d85164cf617e3.jpg",
    repress: 2022,
    sealed: true,
  },
  {
    id: 82,
    name: "A Momentary Lapse Of Reason (Remixed & Updated) (2LP), 1987",
    artist: "Pink Floyd",
    price: 6291,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_a_momentary_lapse_of_reason/pink_floyd_a_momentary_lapse_of_reason_remixed_updated_2lp_1987_18407/",
    image:
      "https://vinylpark.ru/upload/iblock/e04/e04a129415791f5a3aa38f54bdba6e65.jpg",
    repress: 2021,
    sealed: true,
  },
  {
    id: 83,
    name: "The Division Bell (2LP), 1994",
    artist: "Pink Floyd",
    price: 6012,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_the_division_bell/pink_floyd_the_division_bell_2lp_1994_21870/",
    image:
      "https://vinylpark.ru/upload/iblock/e28/e283055bb1c00efa97c00ee90fb175df.jpg",
    repress: 2016,
    sealed: true,
  },
  {
    id: 84,
    name: "Nevermind, 1991",
    artist: "Nirvana",
    price: 5112,
    link: "https://vinylpark.ru/catalog/nirvana/nevermind/nirvana_nevermind_1991_32796/",
    image:
      "https://vinylpark.ru/upload/iblock/e2d/5g549tgqflqslu6iqj4worbihlr8850x.jpg",
    repress: 2023,
    sealed: true,
  },
  {
    id: 85,
    name: "Time, 1981",
    artist: "Electric Light Orchestra",
    price: 5382,
    link: "https://vinylpark.ru/catalog/electric_light_orchestra/elo_time/electric_light_orchestra_time_1981_40828/",
    image:
      "https://vinylpark.ru/upload/iblock/98d/nm6gug8qcga7cv6jvxtfqunnb6srs3t4.jpg",
    repress: 2016,
    sealed: true,
  },
  {
    id: 86,
    name: "Van Halen, 1978",
    artist: "Van Halen",
    price: 3383,
    link: "https://vinylpark.ru/catalog/van_halen/van_halen_1978/van_halen_van_halen_1978_31255/",
    image:
      "https://vinylpark.ru/upload/iblock/b91/stl4jviqwox4b44onvq14yqak2hss5ri.jpg",
    original: 1978,
  },
  {
    id: 87,
    name: "A Salty Dog, 1969",
    artist: "Procol Harum",
    price: 5112,
    link: "https://vinylpark.ru/catalog/procol_harum/harum_a_salty_dog/procol_harum_a_salty_dog_1969_29552/",
    image:
      "https://vinylpark.ru/upload/iblock/21f/w1oem78fabbc4qnlfkwblfffyrvsaj23.jpg",
    repress: 2017,
    sealed: true,
  },
  {
    id: 88,
    name: "Magnum II, 1979",
    artist: "Magnum",
    price: 2193,
    link: "https://vinylpark.ru/catalog/magnum/magnum_magnum_ii/magnum_magnum_ii_1979_21240/",
    image:
      "https://vinylpark.ru/upload/iblock/30f/30f723e7013f3d67b59977caaeeb1e8e.jpg",
    original: 1979,
  },
  {
    id: 89,
    name: "Frank Sinatra (USA), 1975",
    artist: "Frank Sinatra",
    price: 2117,
    link: "https://vinylpark.ru/catalog/frank_sinatra/sborniki__frank_sinatra/frank_sinatra_frank_sinatra_usa_1975_23002/",
    image:
      "https://vinylpark.ru/upload/iblock/60d/60de1c81f8a31f7a9be9483e48dcaabf.jpg",
    original: 1975,
  },
  {
    id: 90,
    name: "Dean Martin's Greatest Hits! Volume 2, 1968",
    artist: "Dean Martin",
    price: 2287,
    link: "https://vinylpark.ru/catalog/dean_martin/dean_martin_dean_martin_s_greatest_hits_volume_2_1968_38362/",
    image:
      "https://vinylpark.ru/upload/iblock/bde/8jf1365bvpuidvnalsu51zqfyckh017w.jpg",
    repress: 1972,
  },
  {
    id: 91,
    name: "Dean Martin's Greatest Hits! Vol.1 (USA), 1968",
    artist: "Dean Martin",
    price: 2117,
    link: "https://vinylpark.ru/catalog/dean_martin/sborniki_dean_martin/dean_martin_dean_martin_s_greatest_hits_vol_1_usa_1968_28725/",
    image:
      "https://vinylpark.ru/upload/iblock/192/dvlw7leto23kivbkgx2slo6w1yz5rlg4.jpg",
    repress: 1970,
  },
  {
    id: 92,
    name: "Dino: Italian Love Songs, 1962",
    artist: "Dean Martin",
    price: 3582,
    link: "https://vinylpark.ru/catalog/dean_martin/martin_dino_italian_love_songs/dean_martin_dino_italian_love_songs_1962_31710/",
    image:
      "https://vinylpark.ru/upload/iblock/e53/yi8ztj7yil8rv1upukk1lym7dikbqpm6.jpg",
    repress: 2017,
    sealed: true,
  },
  {
    id: 93,
    name: "Sounds Of Silence, 1966",
    artist: "Simon & Garfunkel",
    price: 3582,
    link: "https://vinylpark.ru/catalog/simon_and_garfunkel/simon_garfunkel_sounds_of_silence_1966_26796/",
    image:
      "https://vinylpark.ru/upload/iblock/5c7/ao2vimdokxjtodnkgzyzshaj03hrf93t.jpg",
    repress: 2018,
    sealed: true,
  },
  {
    id: 94,
    name: "We Should Be Together (USA), 1979",
    artist: "Crystal Gayle",
    price: 2099,
    link: "https://vinylpark.ru/catalog/crystal_gayle/crystal_gayle_we_should_be_together_usa_1979_38884/",
    image:
      "https://vinylpark.ru/upload/iblock/fcd/9l3huc14l0vg6eaun1qoa4o4pp01rrij.jpg",
    important: true,
    original: 1979,
  },
  {
    id: 95,
    name: "The 1st Album, 1985",
    artist: "Modern Talking",
    price: 4658,
    link: "https://vinylpark.ru/catalog/modern_talking/talking_the_1st_album/modern_talking_the_1st_album_1985_37178/",
    image:
      "https://vinylpark.ru/upload/iblock/270/5bufdosiilp56r4b2lzt9o8of1y48tjk.jpg",
    original: 1985,
  },
  {
    id: 96,
    name: "Electric Universe, 1983",
    artist: "Earth, Wind & Fire",
    price: 1938,
    link: "https://vinylpark.ru/catalog/earth_wind_and_fire/wind_and_fire_electric_universe/earth_wind_fire_electric_universe_1983_21449/",
    image:
      "https://vinylpark.ru/upload/iblock/445/445df793248f15fa11f32c08b24866b9.jpg",
    original: 1983,
  },
  {
    id: 97,
    name: "Winds Of Change (USA), 1982",
    artist: "Jefferson Starship",
    price: 1683,
    link: "https://vinylpark.ru/catalog/jefferson_starship/starship_winds_of_change/jefferson_starship_winds_of_change_1982_21140/",
    image:
      "https://vinylpark.ru/upload/iblock/f4d/f4daa07755c5d3a7f35b7cd7cf1caaf3.jpg",
    important: true,
    original: 1982,
  },
  {
    id: 98,
    name: "Donna Summer, 1982",
    artist: "Donna Summer",
    price: 1607,
    link: "https://vinylpark.ru/catalog/donna_summer/donna_summer_donna_summer_1982_25498/",
    image:
      "https://vinylpark.ru/upload/iblock/8a2/1doxlxoup3o05l7uiy062rz0ektlqfpl.jpg",
    important: true,
    original: 1982,
  },
  {
    id: 99,
    name: "Born In The U.S.A., 1984",
    artist: "Bruce Springsteen",
    price: 3638,
    link: "https://vinylpark.ru/catalog/bruce_springsteen/bruce_springsteen_born_in_the_u_s_a_1984_40365/",
    image:
      "https://vinylpark.ru/upload/iblock/8e8/qlg0587dvm3qunc8fuyvsaqxewj4os0d.jpg",
    repress: 1985,
  },
  {
    id: 100,
    name: "Back In L.A. Vol.1 1936-1937, 1974",
    artist: "Louis Armstrong",
    price: 1607,
    link: "https://vinylpark.ru/catalog/louis_armstrong/louis_armstrong_back_in_l_a_vol_1_1936_1937_1974_596/",
    image:
      "https://vinylpark.ru/upload/iblock/e77/e775f06e29be36f4de11b6dfb412b9f6.jpg",
    original: 1974,
  },
  {
    id: 101,
    name: "16 Original Hits!, 1984",
    artist: "Everly Brothers",
    price: 1607,
    link: "https://vinylpark.ru/catalog/everly_brothers/sborniki_everly_brothers/everly_brothers_16_original_hits_1984_29635/",
    image:
      "https://vinylpark.ru/upload/iblock/d2b/qnek6pxveh6e4bhmlxatcse6v5prb5g1.jpg",
    important: true,
    original: 1984,
  },
  {
    id: 102,
    name: "Whenever You Need Somebody, 1987",
    artist: "Rick Astley",
    price: 2788,
    link: "https://vinylpark.ru/catalog/rick_astley/rick_astley_whenever_you_need_somebody_1987_39280/",
    image:
      "https://vinylpark.ru/upload/iblock/b77/nht4h54ec03pn4m4keubsbpr53ohtjn6.jpg",
    original: 1987,
  },
  {
    id: 103,
    name: "George Duke, 1986",
    artist: "George Duke",
    price: 1607,
    link: "https://vinylpark.ru/catalog/george_duke/george_duke_george_duke_1986_26725/",
    image:
      "https://vinylpark.ru/upload/iblock/4c7/har197m0m4yvsjm19fa3m31urhu9wl6l.jpg",
    original: 1986,
  },
  {
    id: 104,
    name: "Rock Around The Clock (UK), 1970",
    artist: "Bill Haley & The Comets",
    price: 1699,
    link: "https://vinylpark.ru/catalog/bill_haley_the_comets/bill_haley_the_comets_rock_around_the_clock_uk_1970_38879/",
    image:
      "https://vinylpark.ru/upload/iblock/ae3/lyfcswgv66pxbwzyyh0zbfagndfjcxne.jpg",
    important: true,
    original: 1970,
  },
  {
    id: 105,
    name: "Movin' With Nancy",
    artist: "Nancy Sinatra",
    price: 4828,
    link: "https://vinylpark.ru/catalog/nancy_sinatra/sinatra_movin_with_nancy/nancy_sinatra_movin_with_nancy_1967_38404/",
    image: "https://vinylpark.ru/upload/iblock/1b2/l5kwh2zam703pr2x76847nmmoc3730gu.jpg",
    repress: 1968
  },
  {
    id: 106,
    name: "The Final Cut",
    artist: "Pink Floyd",
    price: 5112,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_the_final_cut/pink_floyd_the_final_cut_1982_29330/",
    image: "https://vinylpark.ru/upload/iblock/27b/m5a0ka7stikaun8llu7m352hndpgg7uv.jpg",
    repress: 2017,
    sealed: true
  },
  {
    id: 107,
    name: "The Best Of Nancy-Girl",
    artist: "Nancy Sinatra",
    price: 4913,
    link: "https://vinylpark.ru/catalog/nancy_sinatra/sinatra_the_best_of_nancy_girl/nancy_sinatra_the_best_of_nancy_girl_1968_37012/",
    image: "https://vinylpark.ru/upload/iblock/fd4/6l12zop8vc3m409bv8rdrx9s4ryfj8ee.jpg",
    original: 1968
  },
  {
    id: 108,
    name: "A Day At The Races",
    artist: "Queen",
    price: 5832,
    link: "https://vinylpark.ru/catalog/queen/queen_a_day_at_the_races_1976_18879/",
    image: "https://vinylpark.ru/upload/iblock/921/9213b62c5389783ae0c62e23b3428c68.jpg",
    repress: 2015,
    sealed: true
  },
  {
    id: 109,
    name: "A Kind Of Magic",
    artist: "Queen",
    price: 5202,
    link: "https://vinylpark.ru/catalog/queen/queen_a_kind_of_magic_1986_14266/",
    image: "https://vinylpark.ru/upload/iblock/1b5/1b55f4d60d82f6989bc59551ec7de966.jpg",
    repress: 2015,
    sealed: true
  },
  {
    id: 110,
    name: "A Night At The Opera",
    artist: "Queen",
    price: 6552,
    link: "https://vinylpark.ru/catalog/queen/queen_a_night_at_the_opera_1975_39734/",
    image: "https://vinylpark.ru/upload/iblock/9bf/3umlpaj6q1ndl0kvdohnhf3zez3329hp.jpg",
    repress: 2019,
    sealed: true
  },
  {
    id: 111,
    name: "Greatest Hits (2LP)",
    artist: "Queen",
    price: 7632,
    link: "https://vinylpark.ru/catalog/queen/queen_greatest_hits_2lp_1981_37118/",
    image: "https://vinylpark.ru/upload/iblock/53b/muiryh94y8tkcyejyiv6ezb09yebvsae.jpg",
    repress: 2016,
    sealed: true
  },
  {
    id: 112,
    name: "Greatest Hits II (2LP)",
    artist: "Queen",
    price: 7632,
    link: "https://vinylpark.ru/catalog/queen/queen_greatest_hits_ii_2lp_1991_37997/",
    image: "https://vinylpark.ru/upload/iblock/1c0/q0d6psoo35zvukuflsnia9o0qy2qbvaa.jpg",
    repress: 2016,
    sealed: true
  },
  {
    id: 113,
    name: "Innuendo (2LP)",
    artist: "Queen",
    price: 8712,
    link: "https://vinylpark.ru/catalog/queen/queen_innuendo_2lp_1990_37969/",
    image: "https://vinylpark.ru/upload/iblock/7a9/o7v8dc6u5xkqcgnvzqh6yhzyyegtqiez.jpg",
    repress: 2015,
    sealed: true
  },
  {
    id: 114,
    name: "Made In Heaven (2LP)",
    artist: "Queen",
    price: 8082,
    link: "https://vinylpark.ru/catalog/queen/queen_made_in_heaven_1995_37395/",
    image: "https://vinylpark.ru/upload/iblock/718/3m60b9r7mnr238kv3p8kj6wxk5gml88w.jpg",
    repress: 2015,
    sealed: true
  },
  {
    id: 115,
    name: "Wish You Were Here",
    artist: "Pink Floyd",
    price: 5283,
    link: "https://vinylpark.ru/catalog/pink_floyd/floyd_wish_you_were_here/pink_floyd_the_wall_2lp_1975_36699/",
    image: "https://vinylpark.ru/upload/iblock/e50/mtjv610ootkf2m6go2oefkxoj00li5or.jpg",
    repress: 2016,
    sealed: true
  },
  {
    id: 116,
    name: "Let It Be",
    artist: "Beatles",
    price: 5382,
    link: "https://vinylpark.ru/catalog/beatles/let_it_be/beatles_let_it_be_1970_35847/",
    image: "https://vinylpark.ru/upload/iblock/4c4/wgn925304bbnf10i11rdw4m5na5rkhs0.jpg",
    repress: 2021,
    sealed: true
  },
  {
    id: 117,
    name: "Portrait In Musik",
    artist: "Françoise Hardy",
    price: 5083,
    link: "https://vinylpark.ru/catalog/francoise_hardy/sborniki_fran_oise_hardy/fran_oise_hardy_portrait_in_musik_1965_29103/",
    image: "https://vinylpark.ru/upload/iblock/ca5/3s4kkyrlscgrm9uknxh5t0uafm622oon.jpg",
    original: 1965
  },
  {
    id: 118,
    name: "Blondie",
    artist: "Blondie",
    price: 2958,
    link: "https://vinylpark.ru/catalog/blondie/blondie_1976_album/blondie_blondie_1977_25606/",
    image: "https://vinylpark.ru/upload/iblock/b45/re4xwuabpapl8sf2zqgk799d9y8rfc20.jpg",
    original: 1977
  },
  {
    id: 119,
    name: "Parallel Lines",
    artist: "Blondie",
    price: 4990,
    link: "https://vinylpark.ru/catalog/blondie/parallel_lines/blondie_parallel_lines_1978_39566/",
    image: "https://vinylpark.ru/upload/iblock/c3b/qbx1jp9ij9yf6dpmg1xhvsbqhlqg8d3j.jpg",
    original: 1978
  },
  {
    id: 120,
    name: "About Face",
    artist: "David Gilmour",
    price: 6783,
    link: "https://vinylpark.ru/catalog/david_gilmour/david_gilmour_about_face_1984_39056/",
    image: "https://vinylpark.ru/upload/iblock/4c5/ujv07y2e5leypiilf30rfawtlgr74aot.jpg",
    original: 1984
  },
  {
    id: 121,
    name: "Luck And Strange",
    artist: "David Gilmour",
    price: 7182,
    link: "https://vinylpark.ru/catalog/david_gilmour/david_gilmour_luck_and_strange_2024_33250/",
    image: "https://vinylpark.ru/upload/iblock/d3f/1063yacz3lkl0sqdhd0fx5c3uuo92hca.jpg",
    original: 2024,
    sealed: true
  },
  {
    id: 122,
    name: "On An Island",
    artist: "David Gilmour",
    price: 6732,
    link: "https://vinylpark.ru/catalog/david_gilmour/david_gilmour_on_an_island_2006_24138/",
    image: "https://vinylpark.ru/upload/iblock/67e/23xxbvcb2eoaxnlaav5ep2s7uj73vf0h.jpg",
    repress: 2015,
    sealed: true
  },
  {
    id: 123,
    name: "Between Two Points",
    artist: "David Gilmour With Romany Gilmour",
    price: 5031,
    link: "https://vinylpark.ru/catalog/david_gilmour/david_gilmour_with_romany_gilmour_between_two_points_2025_38224/",
    image: "https://vinylpark.ru/upload/iblock/6fc/n5c7xfqudjuna1owyw86khl8i1xrz908.jpg",
    original: 2025,
    sealed: true
  },
  {
    id: 124,
    name: "Second Winter (2LP, UK)",
    artist: "Johnny Winter",
    price: 5423,
    link: "https://vinylpark.ru/catalog/johnny_winter/winter_second_winter/johnny_winter_second_winter_2lp_uk_1969_26564/",
    image: "https://vinylpark.ru/upload/iblock/7ad/7g5sf0g48000xml281wxil1inrbl57r0.jpg",
    original: 1969
  },
  {
    id: 125,
    name: "Sings The Blues",
    artist: "Louis Armstrong",
    price: 5508,
    link: "https://vinylpark.ru/catalog/louis_armstrong/louis_armstrong_sings_the_blues_1954_35983/",
    image: "https://vinylpark.ru/upload/iblock/621/azy92qrdlvd6t1wardqdwobbxbp7lr9l.jpg",
    repress: 1961
  },
  {
    id: 126,
    name: "Night Visions (Expanded Edition) (2LP)",
    artist: "Imagine Dragons",
    price: 6282,
    link: "https://vinylpark.ru/catalog/imagine_dragons/dragons_night_visions/imagine_dragons_night_visions_expanded_edition_2lp_2012_23510/",
    image: "https://vinylpark.ru/upload/iblock/d6f/izf9mm0vunlaw5vvkoc3tfcotqr17mss.jpg",
    repress: 2022,
    sealed: true
  },
  {
    id: 127,
    name: "Kimono My House",
    artist: "Sparks",
    price: 6012,
    link: "https://vinylpark.ru/catalog/sparks/sparks_kimono_my_house/sparks_kimono_my_house_1974_37599/",
    image: "https://vinylpark.ru/upload/iblock/171/n2omm7oq4bygtcx4k1g46hoqeca43i1g.jpg",
    repress: 2024,
    sealed: true
  },
  {
    id: 128,
    name: "Planet 0712",
    artist: "Electric Dark Souls",
    price: 6183,
    link: "https://vinylpark.ru/catalog/electric_dark_souls/souls_planet_0712/electric_dark_souls_planet_0712_2019_21204/",
    image: "https://vinylpark.ru/upload/iblock/ecb/ecb20fef10f7a16b44b2991a8a7a683d.jpg",
    original: 2019,
    sealed: true
  },
  {
    id: 129,
    name: "From Zero",
    artist: "Linkin Park",
    price: 6201,
    link: "https://vinylpark.ru/catalog/linkin_park/park_from_zero/linkin_park_from_zero_2024_37078/",
    image: "https://vinylpark.ru/upload/iblock/a7f/ilqj932bxg44ib0jfhmrbfc6omh1w8ej.jpg",
    original: 2024,
    sealed: true
  },
  {
    id: 130,
    name: "The Soul Of B. B. King",
    artist: "B.B. King",
    price: 5933,
    link: "https://vinylpark.ru/catalog/bb_king/b_b_king_the_soul_of_b_b_king_1963_40316/",
    image: "https://vinylpark.ru/upload/iblock/74f/9de4ltu126x2cytmjfdgqyh46gv0bhyu.jpg",
    repress: 1984
  },
  {
    id: 131,
    name: "Mr. Bad Guy",
    artist: "Freddie Mercury",
    price: 5933,
    link: "https://vinylpark.ru/catalog/freddie_mercury/mercury_mr_bad_guy/freddie_mercury_mr_bad_guy_1985_35772/",
    image: "https://vinylpark.ru/upload/iblock/4c5/wviii1c3sc87sg648uajcmccy57gque8.jpg",
    original: 1985
  },
  {
    id: 132,
    name: "Origins (2LP)",
    artist: "Imagine Dragons",
    price: 6282,
    link: "https://vinylpark.ru/catalog/imagine_dragons/dragons_origins/imagine_dragons_origins_2lp_2018_14260/",
    image: "https://vinylpark.ru/upload/iblock/aae/aaee25e1cdeebfa036aff7a125bc21dd.jpg",
    original: 2018,
    sealed: true
  },
  {
    id: 133,
    name: "David Gilmour",
    artist: "David Gilmour",
    price: 6162,
    link: "https://vinylpark.ru/catalog/david_gilmour/david_gilmoure__1978_/david_gilmour_david_gilmour_1978_36955/",
    image: "https://vinylpark.ru/upload/iblock/116/03pmjm8i5kdwjww6di6rn3ast4yhjbrm.jpg",
    original: 1978
  },
  {
    id: 134,
    name: "Ride The Lightning (USA)",
    artist: "Metallica",
    price: 6732,
    link: "https://vinylpark.ru/catalog/metallica/metallica_ride_the_lightning/metallica_ride_the_lightning_usa_1984_38207/",
    image: "https://vinylpark.ru/upload/iblock/c4c/o80o6ao5g1q9cbpq5n5eug5a3w6jxzvc.jpg",
    repress: 2016,
    sealed: true
  },
  {
    id: 135,
    name: "Master Of Puppets",
    artist: "Metallica",
    price: 7182,
    link: "https://vinylpark.ru/catalog/metallica/metallica_master_of_puppets_1986_40860/",
    image: "https://vinylpark.ru/upload/iblock/ef6/yg7eb9nugyiulg4dxy6vkzwjxnc013hn.jpg",
    repress: 2017,
    sealed: true
  },
  {
    id: 136,
    name: "Once (2LP)",
    artist: "Nightwish",
    price: 8082,
    link: "https://vinylpark.ru/catalog/nightwish/nightwish_once_2lp_2004_38544/",
    image: "https://vinylpark.ru/upload/iblock/b62/tt36j6t3v2ylbz5wo7vsgydwi86zukmd.jpg",
    repress: 2025,
    sealed: true
  },
  {
    id: 137,
    name: "Human. :||: Nature. (3LP)",
    artist: "Nightwish",
    price: 8091,
    link: "https://vinylpark.ru/catalog/nightwish/nightwish_human_nature_3lp_2020_26290/",
    image: "https://vinylpark.ru/upload/iblock/41b/uml630bwc027vv911ca6b79331iqzfzi.jpg",
    original: 2020,
    sealed: true
  },
  {
    id: 138,
    name: "Dark Passion Play (2LP)",
    artist: "Nightwish",
    price: 10081,
    link: "https://vinylpark.ru/catalog/nightwish/nightwish_dark_passion_play_2lp_2007_17033/",
    image: "https://vinylpark.ru/upload/iblock/f79/f79128cfad77f2e063c3588613bae683.jpg",
    repress: 2013
  },
  {
    id: 139,
    name: "Boston, 1976",
    artist: "Boston",
    price: 4941,
    link: "https://vinylpark.ru/catalog/boston/boston_album/boston_boston_1976_41091/",
    image: "https://vinylpark.ru/upload/iblock/003/wy7swg573rhz6acpoh3r907kqwwb4lgy.jpg",
    repress: 2017,
    sealed: true
  }
]
