const fs = require('fs');
const path = require('path');

const TSV_DATA = `transaction_id	date	month	quarter	sku	product_name	category	subcategory	region	channel	sales_rep	units_sold	unit_price_usd	gross_revenue_usd	discount_pct	net_revenue_usd	cogs_usd	gross_profit_usd
TXN-00417	2024-01-02	2024-01	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	General Trade	Anita Desai	495	3.66	1811.7	5	1721.12	789.55	931.57
TXN-00271	2024-01-04	2024-01	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	North	Direct to Consumer	Sneha Patel	391	9.2	3597.2	0	3597.2	1463.32	2133.88
TXN-00428	2024-01-04	2024-01	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	Modern Trade	Arjun Rao	228	4.4	1003.2	15	852.72	425.77	426.95
TXN-00939	2024-01-05	2024-01	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	General Trade	Karan Malhotra	279	1.25	348.75	0	348.75	161.28	187.47
TXN-00194	2024-01-06	2024-01	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	West	Direct to Consumer	Karan Malhotra	473	9.41	4450.93	0	4450.93	1924.35	2526.58
TXN-00262	2024-01-07	2024-01	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	West	E-Commerce	Vikram Nair	143	11.56	1653.08	5	1570.43	805.73	764.7
TXN-00844	2024-01-07	2024-01	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	Central	Direct to Consumer	Rahul Mehta	219	4.98	1090.62	0	1090.62	504.06	586.56
TXN-00569	2024-01-08	2024-01	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	Central	Modern Trade	Divya Joshi	202	4.73	955.46	10	859.91	447.71	412.2
TXN-00234	2024-01-09	2024-01	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	West	E-Commerce	Divya Joshi	443	2.16	956.88	0	956.88	509.41	447.47
TXN-00743	2024-01-09	2024-01	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	East	Modern Trade	Karan Malhotra	323	4.43	1430.89	5	1359.35	716.58	642.77
TXN-00296	2024-01-10	2024-01	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	Modern Trade	Anita Desai	121	6.89	833.69	0	833.69	341.04	492.65
TXN-00420	2024-01-12	2024-01	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	North	E-Commerce	Rohan Gupta	145	10.41	1509.45	10	1358.51	557.22	801.29
TXN-00535	2024-01-12	2024-01	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	E-Commerce	Arjun Rao	293	7.76	2273.68	0	2273.68	951.5	1322.18
TXN-00481	2024-01-14	2024-01	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	East	General Trade	Priya Sharma	353	3.81	1344.93	0	1344.93	706.47	638.46
TXN-00872	2024-01-14	2024-01	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	West	E-Commerce	Anita Desai	355	7.79	2765.45	0	2765.45	1270.6	1494.85
TXN-00685	2024-01-16	2024-01	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	South	Modern Trade	Meena Krishnan	483	10.14	4897.62	5	4652.74	2016.42	2636.32
TXN-00297	2024-01-17	2024-01	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	Direct to Consumer	Rohan Gupta	13	5.97	77.61	5	73.73	29.62	44.11
TXN-00793	2024-01-17	2024-01	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	Direct to Consumer	Anita Desai	460	5.95	2737.0	0	2737.0	1097.77	1639.23
TXN-00954	2024-01-17	2024-01	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	Modern Trade	Divya Joshi	68	8.69	590.92	5	561.37	239.67	321.7
TXN-00086	2024-01-18	2024-01	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	West	Direct to Consumer	Rohan Gupta	57	11.72	668.04	5	634.64	319.71	314.93
TXN-00957	2024-01-19	2024-01	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	North	Direct to Consumer	Divya Joshi	12	9.37	112.44	0	112.44	47.87	64.57
TXN-00074	2024-01-20	2024-01	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	East	Modern Trade	Rohan Gupta	393	4.24	1666.32	0	1666.32	722.57	943.75
TXN-00405	2024-01-20	2024-01	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	Central	General Trade	Divya Joshi	205	7.91	1621.55	0	1621.55	765.29	856.26
TXN-00889	2024-01-21	2024-01	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	North	E-Commerce	Anita Desai	285	11.08	3157.8	5	2999.91	1495.95	1503.96
TXN-00890	2024-01-21	2024-01	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	Central	Direct to Consumer	Sneha Patel	366	3.3	1207.8	0	1207.8	661.71	546.09
TXN-00142	2024-01-22	2024-01	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	North	General Trade	Karan Malhotra	35	4.28	149.8	0	149.8	82.14	67.66
TXN-00910	2024-01-22	2024-01	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	West	E-Commerce	Sneha Patel	340	2.83	962.2	5	914.09	370.41	543.68
TXN-00128	2024-01-23	2024-01	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	E-Commerce	Sneha Patel	434	2.0	868.0	0	868.0	348.25	519.75
TXN-00413	2024-01-23	2024-01	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	South	E-Commerce	Priya Sharma	85	4.55	386.75	0	386.75	199.62	187.13
TXN-00474	2024-01-23	2024-01	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	South	General Trade	Vikram Nair	311	8.13	2528.43	0	2528.43	1150.41	1378.02
TXN-00622	2024-01-23	2024-01	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	South	Modern Trade	Divya Joshi	105	5.15	540.75	0	540.75	238.14	302.61
TXN-00987	2024-01-24	2024-01	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	E-Commerce	Anita Desai	24	9.59	230.16	5	218.65	106.89	111.76
TXN-00429	2024-01-27	2024-01	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	West	General Trade	Rahul Mehta	115	1.57	180.55	0	180.55	98.68	81.87
TXN-00801	2024-01-30	2024-01	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	North	General Trade	Anita Desai	258	5.16	1331.28	0	1331.28	711.25	620.03
TXN-00002	2024-01-31	2024-01	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	North	Direct to Consumer	Priya Sharma	57	2.36	134.52	5	127.79	62.66	65.13
TXN-00308	2024-01-31	2024-01	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	Direct to Consumer	Arjun Rao	334	1.39	464.26	5	441.05	208.88	232.17
TXN-00806	2024-02-02	2024-02	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	South	E-Commerce	Anita Desai	364	9.8	3567.2	0	3567.2	1499.92	2067.28
TXN-00972	2024-02-02	2024-02	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	South	General Trade	Divya Joshi	423	1.47	621.81	5	590.72	246.39	344.33
TXN-00098	2024-02-03	2024-02	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	Central	Direct to Consumer	Sneha Patel	128	3.51	449.28	0	449.28	227.09	222.19
TXN-00816	2024-02-03	2024-02	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	West	E-Commerce	Divya Joshi	161	7.74	1246.14	0	1246.14	628.94	617.2
TXN-00882	2024-02-03	2024-02	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	West	Direct to Consumer	Priya Sharma	100	4.43	443.0	15	376.55	194.64	181.91
TXN-00769	2024-02-04	2024-02	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	E-Commerce	Vikram Nair	22	12.62	277.64	0	277.64	150.14	127.5
TXN-00137	2024-02-08	2024-02	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	North	General Trade	Priya Sharma	165	3.64	600.6	0	600.6	249.0	351.6
TXN-00257	2024-02-08	2024-02	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	West	General Trade	Sneha Patel	14	3.7	51.8	5	49.21	20.48	28.73
TXN-00576	2024-02-08	2024-02	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	Modern Trade	Karan Malhotra	380	11.34	4309.2	5	4093.74	2014.51	2079.23
TXN-00652	2024-02-08	2024-02	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	General Trade	Rahul Mehta	245	3.54	867.3	0	867.3	381.39	485.91
TXN-00777	2024-02-08	2024-02	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	West	General Trade	Priya Sharma	350	4.81	1683.5	0	1683.5	850.18	833.32
TXN-00193	2024-02-09	2024-02	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	East	General Trade	Anita Desai	156	5.12	798.72	5	758.78	382.74	376.04
TXN-00480	2024-02-10	2024-02	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	West	E-Commerce	Anita Desai	290	2.7	783.0	0	783.0	394.03	388.97
TXN-00782	2024-02-10	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	General Trade	Divya Joshi	206	5.47	1126.82	0	1126.82	568.35	558.47
TXN-00518	2024-02-11	2024-02	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	Central	Modern Trade	Meena Krishnan	229	7.89	1806.81	0	1806.81	757.97	1048.84
TXN-00550	2024-02-11	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	Direct to Consumer	Arjun Rao	122	6.45	786.9	0	786.9	322.18	464.72
TXN-00836	2024-02-11	2024-02	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	East	Modern Trade	Rohan Gupta	81	5.16	417.96	0	417.96	186.5	231.46
TXN-00079	2024-02-12	2024-02	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	Modern Trade	Karan Malhotra	187	8.51	1591.37	10	1432.23	652.5	779.73
TXN-00225	2024-02-12	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	E-Commerce	Karan Malhotra	432	7.35	3175.2	0	3175.2	1291.73	1883.47
TXN-00931	2024-02-12	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	East	General Trade	Divya Joshi	307	5.76	1768.32	0	1768.32	840.95	927.37
TXN-00591	2024-02-13	2024-02	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	Central	Modern Trade	Divya Joshi	444	4.34	1926.96	5	1830.61	818.85	1011.76
TXN-00186	2024-02-14	2024-02	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	Central	General Trade	Rohan Gupta	220	3.04	668.8	10	601.92	262.21	339.71
TXN-00558	2024-02-14	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	Modern Trade	Vikram Nair	75	8.76	657.0	0	657.0	276.08	380.92
TXN-00566	2024-02-14	2024-02	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	West	Direct to Consumer	Arjun Rao	367	5.69	2088.23	0	2088.23	1129.24	958.99
TXN-00091	2024-02-16	2024-02	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	Central	General Trade	Sneha Patel	37	3.09	114.33	10	102.9	55.73	47.17
TXN-00235	2024-02-16	2024-02	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	Direct to Consumer	Arjun Rao	215	4.0	860.0	5	817.0	350.66	466.34
TXN-00381	2024-02-17	2024-02	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	North	Modern Trade	Vikram Nair	251	5.62	1410.62	0	1410.62	602.11	808.51
TXN-00952	2024-02-18	2024-02	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	West	E-Commerce	Karan Malhotra	292	3.02	881.84	0	881.84	420.65	461.19
TXN-00943	2024-02-19	2024-02	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	East	General Trade	Vikram Nair	420	4.03	1692.6	0	1692.6	879.68	812.92
TXN-00451	2024-02-20	2024-02	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	East	Modern Trade	Meena Krishnan	93	6.5	604.5	15	513.82	279.9	233.92
TXN-00922	2024-02-20	2024-02	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	E-Commerce	Anita Desai	215	5.05	1085.75	5	1031.46	452.84	578.62
TXN-00658	2024-02-21	2024-02	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	Central	General Trade	Anita Desai	354	1.49	527.46	5	501.09	273.42	227.67
TXN-00042	2024-02-22	2024-02	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	Direct to Consumer	Sneha Patel	57	7.85	447.45	15	380.33	167.92	212.41
TXN-00189	2024-02-23	2024-02	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	South	General Trade	Sneha Patel	338	6.66	2251.08	0	2251.08	1087.68	1163.4
TXN-00253	2024-02-23	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	General Trade	Vikram Nair	61	5.06	308.66	10	277.79	130.8	146.99
TXN-00744	2024-02-24	2024-02	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	North	E-Commerce	Divya Joshi	10	11.5	115.0	15	97.75	53.45	44.3
TXN-00754	2024-02-24	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	North	E-Commerce	Karan Malhotra	472	8.53	4026.16	15	3422.24	1374.43	2047.81
TXN-00108	2024-02-25	2024-02	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	North	Direct to Consumer	Meena Krishnan	106	2.43	257.58	5	244.7	125.65	119.05
TXN-00498	2024-02-25	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	E-Commerce	Arjun Rao	428	9.19	3933.32	5	3736.65	1680.73	2055.92
TXN-00010	2024-02-27	2024-02	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	General Trade	Arjun Rao	127	5.27	669.29	15	568.9	254.48	314.42
TXN-00123	2024-02-27	2024-02	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	North	Modern Trade	Arjun Rao	160	10.23	1636.8	5	1554.96	655.94	899.02
TXN-00350	2024-03-01	2024-03	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	North	General Trade	Meena Krishnan	151	2.16	326.16	0	326.16	164.78	161.38
TXN-00354	2024-03-05	2024-03	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	North	Direct to Consumer	Arjun Rao	417	4.4	1834.8	0	1834.8	1000.37	834.43
TXN-00638	2024-03-05	2024-03	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	Central	General Trade	Arjun Rao	347	1.53	530.91	15	451.27	206.74	244.53
TXN-00791	2024-03-05	2024-03	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	North	General Trade	Arjun Rao	71	9.19	652.49	15	554.62	256.39	298.23
TXN-00826	2024-03-05	2024-03	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	North	E-Commerce	Vikram Nair	21	5.99	125.79	0	125.79	66.07	59.72
TXN-00023	2024-03-06	2024-03	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	North	General Trade	Vikram Nair	183	3.96	724.68	5	688.45	299.14	389.31
TXN-00900	2024-03-06	2024-03	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	West	Direct to Consumer	Arjun Rao	334	10.03	3350.02	5	3182.52	1400.44	1782.08
TXN-00093	2024-03-07	2024-03	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	East	Direct to Consumer	Rahul Mehta	215	4.96	1066.4	5	1013.08	500.88	512.2
TXN-00400	2024-03-07	2024-03	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	Modern Trade	Priya Sharma	111	1.88	208.68	5	198.25	103.37	94.88
TXN-00733	2024-03-07	2024-03	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	West	Direct to Consumer	Priya Sharma	253	2.18	551.54	5	523.96	245.83	278.13
TXN-00180	2024-03-08	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	Modern Trade	Arjun Rao	178	6.26	1114.28	10	1002.85	459.29	543.56
TXN-00211	2024-03-09	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	Modern Trade	Anita Desai	130	8.94	1162.2	0	1162.2	528.01	634.19
TXN-00711	2024-03-10	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	E-Commerce	Sneha Patel	167	7.33	1224.11	5	1162.9	521.66	641.24
TXN-00034	2024-03-11	2024-03	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	Central	Modern Trade	Anita Desai	314	4.46	1400.44	15	1190.37	518.14	672.23
TXN-00121	2024-03-11	2024-03	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	West	Modern Trade	Karan Malhotra	130	2.52	327.6	0	327.6	180.05	147.55
TXN-00054	2024-03-12	2024-03	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	South	E-Commerce	Meena Krishnan	495	2.53	1252.35	0	1252.35	618.0	634.35
TXN-00739	2024-03-12	2024-03	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	E-Commerce	Meena Krishnan	316	4.79	1513.64	15	1286.59	629.74	656.85
TXN-00625	2024-03-14	2024-03	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	North	E-Commerce	Meena Krishnan	288	10.69	3078.72	0	3078.72	1645.13	1433.59
TXN-00662	2024-03-14	2024-03	Q1-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	Central	General Trade	Vikram Nair	146	1.75	255.5	0	255.5	128.44	127.06
TXN-00037	2024-03-15	2024-03	Q1-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	East	Direct to Consumer	Arjun Rao	14	8.56	119.84	5	113.85	62.55	51.3
TXN-00370	2024-03-15	2024-03	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	Central	General Trade	Rohan Gupta	18	1.47	26.46	0	26.46	11.62	14.84
TXN-00776	2024-03-15	2024-03	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	Modern Trade	Priya Sharma	46	4.62	212.52	0	212.52	109.78	102.74
TXN-00149	2024-03-16	2024-03	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	North	Direct to Consumer	Rohan Gupta	470	3.87	1818.9	5	1727.95	729.63	998.32
TXN-00423	2024-03-16	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	General Trade	Rohan Gupta	419	5.57	2333.83	0	2333.83	940.56	1393.27
TXN-00133	2024-03-18	2024-03	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	East	Modern Trade	Rohan Gupta	82	10.15	832.3	0	832.3	440.3	392.0
TXN-00305	2024-03-19	2024-03	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	Central	General Trade	Meena Krishnan	163	7.44	1212.72	0	1212.72	588.17	624.55
TXN-00020	2024-03-21	2024-03	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	North	General Trade	Karan Malhotra	53	9.62	509.86	15	433.38	177.85	255.53
TXN-00436	2024-03-21	2024-03	Q1-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	South	Modern Trade	Meena Krishnan	359	10.31	3701.29	15	3146.1	1554.44	1591.66
TXN-00102	2024-03-23	2024-03	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	Direct to Consumer	Rohan Gupta	316	7.39	2335.24	5	2218.48	1131.82	1086.66
TXN-00466	2024-03-23	2024-03	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	E-Commerce	Anita Desai	259	4.9	1269.1	0	1269.1	567.3	701.8
TXN-00823	2024-03-23	2024-03	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	South	Direct to Consumer	Rahul Mehta	210	5.39	1131.9	0	1131.9	615.46	516.44
TXN-00181	2024-03-24	2024-03	Q1-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	General Trade	Arjun Rao	308	6.75	2079.0	0	2079.0	928.35	1150.65
TXN-00267	2024-03-24	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	General Trade	Karan Malhotra	279	5.36	1495.44	10	1345.9	611.4	734.5
TXN-00310	2024-03-25	2024-03	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	General Trade	Rahul Mehta	147	1.37	201.39	10	181.25	93.81	87.44
TXN-00190	2024-03-26	2024-03	Q1-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	Central	Modern Trade	Sneha Patel	400	5.2	2080.0	5	1976.0	1058.73	917.27
TXN-00904	2024-03-26	2024-03	Q1-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	West	Modern Trade	Priya Sharma	170	5.3	901.0	15	765.85	313.64	452.21
TXN-00178	2024-03-27	2024-03	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	West	Modern Trade	Arjun Rao	268	6.3	1688.4	0	1688.4	738.1	950.3
TXN-00760	2024-03-27	2024-03	Q1-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	Modern Trade	Arjun Rao	84	4.63	388.92	15	330.58	139.88	190.7
TXN-00920	2024-03-27	2024-03	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	E-Commerce	Vikram Nair	222	1.94	430.68	5	409.15	217.45	191.7
TXN-00153	2024-03-28	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	Modern Trade	Rahul Mehta	57	8.63	491.91	10	442.72	226.15	216.57
TXN-00560	2024-03-28	2024-03	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	Modern Trade	Sneha Patel	120	1.54	184.8	5	175.56	93.06	82.5
TXN-00365	2024-03-29	2024-03	Q1-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	Central	Direct to Consumer	Vikram Nair	469	3.18	1491.42	15	1267.71	530.5	737.21
TXN-00770	2024-03-29	2024-03	Q1-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	Modern Trade	Rahul Mehta	448	6.95	3113.6	5	2957.92	1474.4	1483.52
TXN-00437	2024-03-30	2024-03	Q1-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	E-Commerce	Rahul Mehta	208	1.98	411.84	5	391.25	175.64	215.61
TXN-00702	2024-03-30	2024-03	Q1-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	Central	E-Commerce	Arjun Rao	35	4.86	170.1	0	170.1	72.16	97.94
TXN-00841	2024-03-30	2024-03	Q1-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	East	Direct to Consumer	Divya Joshi	120	2.03	243.6	5	231.42	118.31	113.11
TXN-00631	2024-04-01	2024-04	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	Central	General Trade	Arjun Rao	137	3.29	450.73	0	450.73	226.67	224.06
TXN-00623	2024-04-02	2024-04	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	West	Modern Trade	Vikram Nair	87	4.99	434.13	0	434.13	195.92	238.21
TXN-00740	2024-04-02	2024-04	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	East	Direct to Consumer	Priya Sharma	121	3.98	481.58	5	457.5	244.99	212.51
TXN-00906	2024-04-02	2024-04	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	Central	E-Commerce	Rohan Gupta	131	5.91	774.21	15	658.08	342.86	315.22
TXN-00894	2024-04-04	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	West	General Trade	Karan Malhotra	377	1.68	633.36	0	633.36	309.57	323.79
TXN-00301	2024-04-05	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	Modern Trade	Priya Sharma	217	11.33	2458.61	5	2335.68	1101.04	1234.64
TXN-00026	2024-04-06	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	West	Direct to Consumer	Vikram Nair	59	12.16	717.44	0	717.44	332.56	384.88
TXN-00564	2024-04-08	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	General Trade	Karan Malhotra	100	6.79	679.0	5	645.05	316.06	328.99
TXN-00854	2024-04-08	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	East	E-Commerce	Arjun Rao	283	8.33	2357.39	15	2003.78	844.71	1159.07
TXN-00237	2024-04-09	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	Modern Trade	Anita Desai	211	1.53	322.83	0	322.83	156.14	166.69
TXN-00096	2024-04-11	2024-04	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	East	Modern Trade	Karan Malhotra	495	4.34	2148.3	10	1933.47	834.59	1098.88
TXN-00356	2024-04-11	2024-04	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	East	Modern Trade	Priya Sharma	330	5.22	1722.6	5	1636.47	658.58	977.89
TXN-00915	2024-04-12	2024-04	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	West	E-Commerce	Meena Krishnan	432	6.09	2630.88	0	2630.88	1252.17	1378.71
TXN-00455	2024-04-14	2024-04	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	Direct to Consumer	Karan Malhotra	13	7.76	100.88	10	90.79	49.48	41.31
TXN-00552	2024-04-15	2024-04	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	North	Modern Trade	Arjun Rao	370	5.56	2057.2	10	1851.48	971.0	880.48
TXN-00723	2024-04-15	2024-04	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	East	Direct to Consumer	Priya Sharma	276	5.89	1625.64	10	1463.08	653.81	809.27
TXN-00505	2024-04-16	2024-04	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	Central	General Trade	Anita Desai	208	6.42	1335.36	5	1268.59	675.4	593.19
TXN-00478	2024-04-17	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	General Trade	Meena Krishnan	271	1.24	336.04	0	336.04	148.67	187.37
TXN-00017	2024-04-18	2024-04	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	Central	General Trade	Divya Joshi	455	6.73	3062.15	15	2602.83	1290.59	1312.24
TXN-00327	2024-04-18	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	E-Commerce	Meena Krishnan	15	9.07	136.05	0	136.05	64.84	71.21
TXN-00728	2024-04-18	2024-04	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	North	Direct to Consumer	Priya Sharma	206	8.61	1773.66	5	1684.98	773.05	911.93
TXN-00311	2024-04-19	2024-04	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	West	E-Commerce	Arjun Rao	56	11.12	622.72	0	622.72	290.63	332.09
TXN-00317	2024-04-19	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	West	General Trade	Rohan Gupta	79	10.06	794.74	5	755.0	339.62	415.38
TXN-00590	2024-04-19	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	South	E-Commerce	Anita Desai	71	11.76	834.96	10	751.46	408.32	343.14
TXN-00077	2024-04-20	2024-04	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	North	General Trade	Sneha Patel	306	3.58	1095.48	0	1095.48	532.81	562.67
TXN-00135	2024-04-20	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	East	Direct to Consumer	Arjun Rao	355	6.76	2399.8	0	2399.8	1182.94	1216.86
TXN-00252	2024-04-21	2024-04	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	East	E-Commerce	Anita Desai	325	2.82	916.5	0	916.5	399.93	516.57
TXN-00544	2024-04-21	2024-04	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	East	Direct to Consumer	Divya Joshi	99	2.01	198.99	0	198.99	104.72	94.27
TXN-00563	2024-04-21	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	West	Direct to Consumer	Anita Desai	18	11.61	208.98	15	177.63	95.28	82.35
TXN-00196	2024-04-23	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	Direct to Consumer	Rahul Mehta	438	6.19	2711.22	5	2575.66	1237.37	1338.29
TXN-00988	2024-04-23	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	Direct to Consumer	Divya Joshi	384	10.01	3843.84	0	3843.84	1687.31	2156.53
TXN-00019	2024-04-24	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	Direct to Consumer	Priya Sharma	485	1.63	790.55	15	671.97	350.11	321.86
TXN-00824	2024-04-24	2024-04	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	North	General Trade	Sneha Patel	366	4.97	1819.02	0	1819.02	966.35	852.67
TXN-00487	2024-04-25	2024-04	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	West	Direct to Consumer	Anita Desai	77	4.5	346.5	0	346.5	189.62	156.88
TXN-00629	2024-04-25	2024-04	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	Modern Trade	Vikram Nair	130	11.62	1510.6	0	1510.6	607.65	902.95
TXN-00344	2024-04-26	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	West	Modern Trade	Karan Malhotra	147	2.13	313.11	15	266.14	146.01	120.13
TXN-00168	2024-04-27	2024-04	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	West	Direct to Consumer	Sneha Patel	217	1.8	390.6	0	390.6	166.31	224.29
TXN-00762	2024-04-28	2024-04	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	Modern Trade	Sneha Patel	36	4.44	159.84	5	151.85	71.59	80.26
TXN-00936	2024-04-28	2024-04	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	South	Direct to Consumer	Meena Krishnan	468	8.53	3992.04	0	3992.04	1861.2	2130.84
TXN-00583	2024-04-29	2024-04	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	North	E-Commerce	Arjun Rao	421	2.89	1216.69	0	1216.69	646.57	570.12
TXN-00585	2024-04-29	2024-04	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	West	Modern Trade	Rohan Gupta	142	5.55	788.1	10	709.29	367.62	341.67
TXN-00831	2024-04-29	2024-04	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	General Trade	Vikram Nair	31	5.65	175.15	5	166.39	69.71	96.68
TXN-00214	2024-04-30	2024-04	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	West	Direct to Consumer	Divya Joshi	144	10.1	1454.4	10	1308.96	611.21	697.75
TXN-00698	2024-04-30	2024-04	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	West	E-Commerce	Anita Desai	470	5.49	2580.3	0	2580.3	1033.49	1546.81
TXN-00923	2024-04-30	2024-04	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	East	General Trade	Karan Malhotra	17	5.02	85.34	5	81.07	41.83	39.24
TXN-00274	2024-05-01	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	Central	General Trade	Arjun Rao	101	5.35	540.35	5	513.33	246.05	267.28
TXN-00496	2024-05-01	2024-05	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	West	Direct to Consumer	Arjun Rao	264	6.71	1771.44	0	1771.44	735.85	1035.59
TXN-00862	2024-05-01	2024-05	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	Central	Modern Trade	Rohan Gupta	475	2.12	1007.0	0	1007.0	448.36	558.64
TXN-00165	2024-05-02	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	East	E-Commerce	Arjun Rao	13	10.23	132.99	5	126.34	53.87	72.47
TXN-00656	2024-05-03	2024-05	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	East	Direct to Consumer	Meena Krishnan	455	2.04	928.2	10	835.38	415.95	419.43
TXN-00998	2024-05-03	2024-05	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	North	Direct to Consumer	Rahul Mehta	199	2.09	415.91	0	415.91	198.98	216.93
TXN-00215	2024-05-05	2024-05	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	East	Direct to Consumer	Vikram Nair	79	1.71	135.09	5	128.34	54.66	73.68
TXN-00101	2024-05-07	2024-05	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	Central	E-Commerce	Rohan Gupta	249	4.36	1085.64	10	977.08	449.82	527.26
TXN-00847	2024-05-07	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	East	E-Commerce	Rohan Gupta	344	10.41	3581.04	0	3581.04	1656.49	1924.55
TXN-00860	2024-05-08	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	South	General Trade	Sneha Patel	117	6.42	751.14	0	751.14	348.32	402.82
TXN-00959	2024-05-08	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	E-Commerce	Rahul Mehta	79	8.99	710.21	0	710.21	371.01	339.2
TXN-00118	2024-05-09	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	South	Direct to Consumer	Priya Sharma	267	6.58	1756.86	0	1756.86	931.94	824.92
TXN-00377	2024-05-09	2024-05	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	East	General Trade	Arjun Rao	393	3.69	1450.17	0	1450.17	739.5	710.67
TXN-00071	2024-05-10	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	General Trade	Rohan Gupta	328	6.83	2240.24	5	2128.23	1040.24	1087.99
TXN-00996	2024-05-10	2024-05	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	South	General Trade	Divya Joshi	258	3.06	789.48	0	789.48	430.43	359.05
TXN-00925	2024-05-13	2024-05	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	East	Direct to Consumer	Meena Krishnan	230	9.36	2152.8	5	2045.16	884.19	1160.97
TXN-00682	2024-05-14	2024-05	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	South	General Trade	Rahul Mehta	104	6.68	694.72	5	659.98	325.07	334.91
TXN-00363	2024-05-16	2024-05	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	East	General Trade	Meena Krishnan	338	1.78	601.64	0	601.64	246.83	354.81
TXN-00391	2024-05-16	2024-05	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	Central	Modern Trade	Divya Joshi	336	5.55	1864.8	0	1864.8	911.49	953.31
TXN-00040	2024-05-17	2024-05	Q2-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	Central	E-Commerce	Rahul Mehta	145	4.87	706.15	0	706.15	361.1	345.05
TXN-00543	2024-05-17	2024-05	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	West	E-Commerce	Arjun Rao	357	5.83	2081.31	5	1977.24	928.17	1049.07
TXN-00883	2024-05-17	2024-05	Q2-2024	NB-CLNR-002	NovaBite Dishwash Liquid 500ml	Home Care	Dishwash	South	Direct to Consumer	Meena Krishnan	169	3.87	654.03	5	621.33	319.74	301.59
TXN-00072	2024-05-18	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	North	Modern Trade	Meena Krishnan	453	7.94	3596.82	0	3596.82	1579.09	2017.73
TXN-00202	2024-05-18	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	Direct to Consumer	Anita Desai	42	8.11	340.62	5	323.59	131.23	192.36
TXN-00341	2024-05-19	2024-05	Q2-2024	NB-WASH-001	NovaBite Liquid Hand Wash 250ml	Personal Care	Hand Wash	East	Modern Trade	Rohan Gupta	109	5.61	611.49	5	580.92	276.41	304.51
TXN-00465	2024-05-20	2024-05	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	West	Modern Trade	Anita Desai	112	11.14	1247.68	5	1185.3	632.86	552.44
TXN-00012	2024-05-22	2024-05	Q2-2024	NB-CLNR-001	NovaBite Multi-Surface Spray 750ml	Home Care	Cleaner	West	General Trade	Sneha Patel	136	6.97	947.92	5	900.52	395.7	504.82
TXN-00555	2024-05-22	2024-05	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	West	Modern Trade	Divya Joshi	235	5.6	1316.0	0	1316.0	627.97	688.03
TXN-00306	2024-05-23	2024-05	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	Central	E-Commerce	Meena Krishnan	414	4.13	1709.82	10	1538.84	633.64	905.2
TXN-00549	2024-05-23	2024-05	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	Central	General Trade	Divya Joshi	238	7.43	1768.34	5	1679.92	911.03	768.89
TXN-00905	2024-05-23	2024-05	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	East	Modern Trade	Meena Krishnan	130	4.06	527.8	10	475.02	225.65	249.37
TXN-00100	2024-05-25	2024-05	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	South	General Trade	Sneha Patel	46	1.72	79.12	15	67.25	30.0	37.25
TXN-00159	2024-05-25	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	South	Direct to Consumer	Rahul Mehta	389	7.88	3065.32	0	3065.32	1268.32	1797.0
TXN-00561	2024-05-26	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	South	Direct to Consumer	Karan Malhotra	416	7.84	3261.44	15	2772.22	1184.52	1587.7
TXN-00119	2024-05-27	2024-05	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	North	Direct to Consumer	Priya Sharma	219	5.03	1101.57	0	1101.57	452.99	648.58
TXN-00113	2024-05-28	2024-05	Q2-2024	NB-SNCK-003	NovaBite Granola Pouch 250g	Snacks	Granola	South	Direct to Consumer	Divya Joshi	206	4.06	836.36	5	794.54	378.39	416.15
TXN-00144	2024-05-28	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	Central	Modern Trade	Sneha Patel	76	8.11	616.36	15	523.91	223.28	300.63
TXN-00679	2024-05-28	2024-05	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	East	General Trade	Meena Krishnan	345	7.69	2653.05	0	2653.05	1187.57	1465.48
TXN-00981	2024-05-29	2024-05	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	East	Modern Trade	Rohan Gupta	404	2.41	973.64	15	827.59	395.26	432.33
TXN-00060	2024-05-30	2024-05	Q2-2024	NB-SHMP-002	NovaBite Shampoo Keratin 400ml	Personal Care	Shampoo	East	General Trade	Vikram Nair	22	8.57	188.54	5	179.11	88.07	91.04
TXN-00299	2024-06-01	2024-06	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	North	Modern Trade	Divya Joshi	133	9.56	1271.48	5	1207.91	528.9	679.01
TXN-00403	2024-06-01	2024-06	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	East	E-Commerce	Rohan Gupta	27	10.35	279.45	5	265.48	115.98	149.5
TXN-00786	2024-06-01	2024-06	Q2-2024	NB-WASH-002	NovaBite Foaming Hand Wash 300ml	Personal Care	Hand Wash	South	Direct to Consumer	Divya Joshi	389	5.23	2034.47	0	2034.47	825.04	1209.43
TXN-00951	2024-06-01	2024-06	Q2-2024	NB-SNCK-002	NovaBite Mixed Nuts Pack 100g	Snacks	Nuts	North	Direct to Consumer	Sneha Patel	75	4.12	309.0	0	309.0	162.61	146.39
TXN-00067	2024-06-03	2024-06	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	Central	Modern Trade	Anita Desai	128	1.84	235.52	0	235.52	119.16	116.36
TXN-00174	2024-06-03	2024-06	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	E-Commerce	Arjun Rao	235	1.61	378.35	5	359.43	177.81	181.62
TXN-00747	2024-06-06	2024-06	Q2-2024	NB-BVGR-001	NovaBite Green Tea 500ml	Beverages	Tea	West	E-Commerce	Meena Krishnan	157	3.31	519.67	10	467.7	195.89	271.81
TXN-00941	2024-06-06	2024-06	Q2-2024	NB-SNCK-001	NovaBite Oats & Honey Bar 40g	Snacks	Energy Bar	Central	Modern Trade	Arjun Rao	24	1.78	42.72	15	36.31	18.38	17.93
TXN-00977	2024-06-06	2024-06	Q2-2024	NB-COND-001	NovaBite Conditioner Argan 300ml	Personal Care	Conditioner	West	Direct to Consumer	Rahul Mehta	341	10.19	3474.79	15	2953.57	1242.47	1711.1
TXN-00004	2024-06-08	2024-06	Q2-2024	NB-SHMP-001	NovaBite Shampoo Coconut 400ml	Personal Care	Shampoo	West	E-Commerce	Sneha Patel	120	12.23	1467.6	0	1467.6	609.54	858.06
TXN-00161	2024-06-08	2024-06	Q2-2024	NB-BVGR-002	NovaBite Sparkling Water Lemon 330ml	Beverages	Water	Central	Modern Trade	Priya Sharma	90	1.59	143.1	0	143.1	71.71	71.39
`;

function parseTSV(tsv) {
  const lines = tsv.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    if (values.length < headers.length) continue;
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j];
    }
    records.push(row);
  }
  return records;
}

function convertToCSV(records) {
  // Map fields to what seed.js expects
  // Expected headers: date,region,channel,product,category,sales_rep,units_sold,gross_revenue,discount_amount,net_revenue,cogs,gross_profit
  const mappedRecords = records.map(row => {
    const gross_revenue = parseFloat(row.gross_revenue_usd);
    const net_revenue = parseFloat(row.net_revenue_usd);
    const discount_amount = parseFloat((gross_revenue - net_revenue).toFixed(2));
    
    return {
      date: row.date,
      region: row.region,
      channel: row.channel,
      product: row.product_name,
      category: row.category,
      sales_rep: row.sales_rep,
      units_sold: parseInt(row.units_sold, 10),
      gross_revenue: gross_revenue,
      discount_amount: discount_amount,
      net_revenue: net_revenue,
      cogs: parseFloat(row.cogs_usd),
      gross_profit: parseFloat(row.gross_profit_usd)
    };
  });

  const headers = ['date', 'region', 'channel', 'product', 'category', 'sales_rep', 'units_sold', 'gross_revenue', 'discount_amount', 'net_revenue', 'cogs', 'gross_profit'];
  const csvLines = [headers.join(',')];

  for (const rec of mappedRecords) {
    const line = headers.map(h => {
      let val = rec[h];
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val}"`;
      }
      return val;
    }).join(',');
    csvLines.push(line);
  }

  return csvLines.join('\n');
}

const records = parseTSV(TSV_DATA);
const csvContent = convertToCSV(records);

const CSV_PATH = path.join(__dirname, '../data/novabite_sales_data.csv');
const dataDir = path.dirname(CSV_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(CSV_PATH, csvContent, 'utf-8');
console.log(`Successfully wrote ${records.length} records to ${CSV_PATH}`);
