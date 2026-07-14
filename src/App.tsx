import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, CalendarDays, CheckCircle2, CreditCard, Globe2, Heart, LockKeyhole,
  Mail, MapPin, Menu, Phone, Search, ShieldCheck, Star, Sun, Moon, UserRound,
  Users, WalletCards, X
} from 'lucide-react';

type Destination = {
  id:number; city:string; country:string; region:string; image:string;
  price:number; rating:number; tag:string; description:string;
};

type Hotel = {
  id:number; destinationId:number; name:string; image:string;
  price:number; rating:number; amenities:string[];
};

type Booking = {
  id:string; destination:Destination; hotel:Hotel; checkIn:string;
  checkOut:string; guests:number; subtotal:number; taxes:number; serviceFee:number;
  total:number; guestName:string; guestEmail:string; paymentMethod:string;
  createdAt:string; status:'Confirmed';
};

type CheckoutStep = 'hotel' | 'guest' | 'payment' | 'review' | 'confirmed';

type CheckoutData = {
  firstName:string; lastName:string; email:string; phone:string; country:string;
  requests:string; paymentMethod:'card'|'property'; cardName:string; cardNumber:string;
  expiry:string; cvc:string; acceptPolicy:boolean;
};

type Errors = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
};

const destinations: Destination[] = [
  {id:1,city:'Santorini',country:'Greece',region:'Europe',image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',price:1280,rating:4.9,tag:'Island escape',description:'Whitewashed villages, volcanic beaches, and unforgettable Aegean sunsets.'},
  {id:2,city:'Kyoto',country:'Japan',region:'Asia',image:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',price:1460,rating:4.8,tag:'Culture',description:'Historic temples, quiet gardens, and refined seasonal cuisine.'},
  {id:3,city:'Banff',country:'Canada',region:'North America',image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',price:980,rating:4.9,tag:'Mountain retreat',description:'Turquoise lakes, alpine trails, and dramatic Rocky Mountain scenery.'},
  {id:4,city:'Amalfi',country:'Italy',region:'Europe',image:'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200&q=85',price:1540,rating:4.8,tag:'Coastal',description:'Clifftop villages, citrus groves, and sunlit Mediterranean coastlines.'},
  {id:5,city:'Marrakech',country:'Morocco',region:'Africa',image:'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=85',price:890,rating:4.7,tag:'Design & food',description:'Vibrant souks, intimate riads, and richly layered local culture.'},
  {id:6,city:'Bali',country:'Indonesia',region:'Asia',image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',price:1120,rating:4.8,tag:'Wellness',description:'Tropical landscapes, oceanfront stays, and restorative island rituals.'},
  {id:7,city:'Paris',country:'France',region:'Europe',image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',price:1380,rating:4.8,tag:'City break',description:'Iconic architecture, neighbourhood cafés, galleries, and timeless style.'},
  {id:8,city:'London',country:'United Kingdom',region:'Europe',image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',price:1320,rating:4.7,tag:'Culture',description:'Historic landmarks, contemporary design, theatre, and global dining.'},
  {id:9,city:'New York',country:'United States',region:'North America',image:'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85',price:1490,rating:4.8,tag:'Urban energy',description:'World-class museums, neighbourhood discoveries, and unforgettable skyline views.'},
  {id:10,city:'Vancouver',country:'Canada',region:'North America',image:'https://images.unsplash.com/photo-1560814304-4f05b62af116?auto=format&fit=crop&w=1200&q=85',price:1080,rating:4.7,tag:'Coast & city',description:'Ocean, mountains, modern cuisine, and effortless access to nature.'},
  {id:11,city:'Dubai',country:'United Arab Emirates',region:'Middle East',image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',price:1250,rating:4.7,tag:'Luxury',description:'Bold architecture, desert experiences, waterfront stays, and modern hospitality.'},
  {id:12,city:'Istanbul',country:'Türkiye',region:'Middle East',image:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85',price:920,rating:4.8,tag:'History & food',description:'Layered history, Bosphorus views, bazaars, and memorable regional cuisine.'},
  {id:13,city:'Sydney',country:'Australia',region:'Oceania',image:'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=85',price:1510,rating:4.8,tag:'Harbour',description:'Iconic harbour views, coastal walks, beaches, and outstanding restaurants.'},
  {id:14,city:'Auckland',country:'New Zealand',region:'Oceania',image:'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85',price:1390,rating:4.7,tag:'Nature gateway',description:'Volcanic landscapes, waterfront neighbourhoods, and island day trips.'},
  {id:15,city:'Delhi',country:'India',region:'Asia',image:'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85',price:760,rating:4.6,tag:'Heritage',description:'Historic monuments, vibrant markets, celebrated food, and rich cultural depth.'},
  {id:16,city:'Mumbai',country:'India',region:'Asia',image:'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=85',price:820,rating:4.7,tag:'Coastal city',description:'Art deco streets, seaside promenades, cinema, and energetic dining.'},
  {id:17,city:'Cape Town',country:'South Africa',region:'Africa',image:'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=85',price:1040,rating:4.9,tag:'Scenic escape',description:'Mountain views, ocean drives, vineyards, and exceptional local food.'},
  {id:18,city:'Rio de Janeiro',country:'Brazil',region:'South America',image:'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=85',price:1090,rating:4.7,tag:'Beach & culture',description:'Dramatic landscapes, famous beaches, music, and vibrant neighbourhood life.'}
];

const hotels: Hotel[] = destinations.flatMap((d, index) => ([
  {
    id:index*2+1,destinationId:d.id,name:`${d.city} Grand House`,
    image:d.image,price:Math.round(190+d.price/8),rating:Math.min(4.9,d.rating),
    amenities:['Breakfast','Central location','Free Wi‑Fi']
  },
  {
    id:index*2+2,destinationId:d.id,name:`The ${d.city} Collection`,
    image:d.image,price:Math.round(255+d.price/7),rating:Math.max(4.6,d.rating-.1),
    amenities:['Premium room','Flexible check-in','Guest concierge']
  }
]));

const getStored = <T,>(key:string, fallback:T):T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

const todayISO = () => new Date().toISOString().slice(0,10);
const futureISO = (days:number) => {
  const d = new Date();
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
};

const normalizeSearch = (value:string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,' ')
    .trim();

const initialCheckout: CheckoutData = {
  firstName:'', lastName:'', email:'', phone:'', country:'Canada', requests:'',
  paymentMethod:'card', cardName:'', cardNumber:'', expiry:'', cvc:'', acceptPolicy:false
};

const cardDigits = (value:string) => value.replace(/\D/g,'').slice(0,19);
const formatCard = (value:string) => cardDigits(value).replace(/(.{4})/g,'$1 ').trim();
const formatExpiry = (value:string) => {
  const digits=value.replace(/\D/g,'').slice(0,4);
  return digits.length>2?`${digits.slice(0,2)}/${digits.slice(2)}`:digits;
};
const validExpiry = (value:string) => {
  if(!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [month,year]=value.split('/').map(Number);
  if(month<1||month>12) return false;
  const now=new Date();
  const fullYear=2000+year;
  return fullYear>now.getFullYear()||(fullYear===now.getFullYear()&&month>=now.getMonth()+1);
};

export default function App(){
  const [theme,setTheme]=useState<'light'|'dark'>(()=>getStored('voyagr_theme','light'));
  const [query,setQuery]=useState('');
  const [region,setRegion]=useState('All');
  const [checkIn,setCheckIn]=useState('');
  const [checkOut,setCheckOut]=useState('');
  const [guests,setGuests]=useState(2);
  const [favorites,setFavorites]=useState<number[]>(()=>getStored('voyagr_favorites',[]));
  const [bookings,setBookings]=useState<Booking[]>(()=>getStored('voyagr_bookings',[]));
  const [selected,setSelected]=useState<Destination|null>(null);
  const [selectedHotel,setSelectedHotel]=useState<Hotel|null>(null);
  const [checkoutStep,setCheckoutStep]=useState<CheckoutStep>('hotel');
  const [checkout,setCheckout]=useState<CheckoutData>(initialCheckout);
  const [checkoutErrors,setCheckoutErrors]=useState<Record<string,string>>({});
  const [confirmedBooking,setConfirmedBooking]=useState<Booking|null>(null);
  const [panel,setPanel]=useState<'favorites'|'trips'|null>(null);
  const [mobile,setMobile]=useState(false);
  const [toast,setToast]=useState('');
  const [errors,setErrors]=useState<Errors>({});
  const [suggestionsOpen,setSuggestionsOpen]=useState(false);
  const locationRef=useRef<HTMLDivElement>(null);
  const checkInRef=useRef<HTMLInputElement>(null);
  const checkOutRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('voyagr_theme',JSON.stringify(theme))},[theme]);
  useEffect(()=>localStorage.setItem('voyagr_favorites',JSON.stringify(favorites)),[favorites]);
  useEffect(()=>localStorage.setItem('voyagr_bookings',JSON.stringify(bookings)),[bookings]);

  useEffect(()=>{
    const handler=(event:MouseEvent)=>{
      if(locationRef.current&&!locationRef.current.contains(event.target as Node)) setSuggestionsOpen(false);
    };
    document.addEventListener('mousedown',handler);
    return()=>document.removeEventListener('mousedown',handler);
  },[]);

  const locationSuggestions=useMemo(()=>{
    const normalized=normalizeSearch(query);
    const unique=[...new Map(destinations.map(d=>[`${d.city}, ${d.country}`,d])).values()];
    if(!normalized) return unique.slice(0,8);
    return unique.filter(d=>
      normalizeSearch(`${d.city} ${d.country} ${d.region}`).includes(normalized)
    ).slice(0,10);
  },[query]);

  const filtered=useMemo(()=>destinations.filter(d=>{
    const normalized=normalizeSearch(query);
    const haystack=normalizeSearch(`${d.city} ${d.country} ${d.region}`);
    const matchQuery=!normalized||haystack.includes(normalized);
    const matchRegion=region==='All'||d.region===region;
    return matchQuery&&matchRegion;
  }),[query,region]);

  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),2400)};
  const toggleFavorite=(id:number)=>setFavorites(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);

  function validateSearch():boolean{
    const next:Errors={};
    if(!query.trim()) {
      next.location='Choose a city or country from the suggestions.';
    } else {
      const normalized=normalizeSearch(query);
      const validLocation=destinations.some(d=>
        normalizeSearch(`${d.city} ${d.country}`).includes(normalized) ||
        normalized.includes(normalizeSearch(`${d.city} ${d.country}`))
      );
      if(!validLocation) next.location='Select a valid city or country from the suggestions.';
    }
    if(!checkIn) next.checkIn='Select a check-in date.';
    if(!checkOut) next.checkOut='Select a check-out date.';
    if(checkIn&&checkIn<todayISO()) next.checkIn='Check-in cannot be in the past.';
    if(checkIn&&checkOut&&checkOut<=checkIn) next.checkOut='Check-out must be after check-in.';
    if(checkIn&&checkIn>futureISO(730)) next.checkIn='Choose a date within the next two years.';
    if(checkOut&&checkOut>futureISO(760)) next.checkOut='Choose a date within the next two years.';
    setErrors(next);
    return Object.keys(next).length===0;
  }

  function handleSearch(){
    if(!validateSearch()){
      notify('Please correct the highlighted travel details.');
      return;
    }
    setSuggestionsOpen(false);
    document.getElementById('discover')?.scrollIntoView({behavior:'smooth'});
    notify(filtered.length?`${filtered.length} destination${filtered.length===1?'':'s'} found.`:'No matching destination found.');
  }

  function chooseLocation(destination:Destination){
    setQuery(`${destination.city}, ${destination.country}`);
    setSuggestionsOpen(false);
    setErrors(current=>({...current,location:undefined}));
  }

  function onCheckIn(value:string){
    setCheckIn(value);
    setErrors(current=>({...current,checkIn:undefined,checkOut:undefined}));
    if(checkOut&&checkOut<=value) setCheckOut('');
  }

  function onCheckOut(value:string){
    setCheckOut(value);
    setErrors(current=>({...current,checkOut:undefined}));
  }

  function openCalendar(ref:React.RefObject<HTMLInputElement|null>){
    const el=ref.current as (HTMLInputElement & {showPicker?:()=>void})|null;
    el?.showPicker?.();
  }

  function nightsCount(){
    if(!checkIn||!checkOut) return 1;
    return Math.max(1,Math.ceil((new Date(checkOut).getTime()-new Date(checkIn).getTime())/86400000));
  }

  function priceBreakdown(hotel:Hotel){
    const subtotal=hotel.price*nightsCount();
    const serviceFee=Math.round(subtotal*0.08);
    const taxes=Math.round(subtotal*0.13);
    return {subtotal,serviceFee,taxes,total:subtotal+serviceFee+taxes};
  }

  function beginCheckout(destination:Destination,hotel:Hotel){
    if(!validateSearch()){
      setSelected(null);
      notify('Add valid travel dates before booking.');
      window.scrollTo({top:0,behavior:'smooth'});
      return;
    }
    setSelected(destination);
    setSelectedHotel(hotel);
    setCheckoutStep('guest');
    setCheckoutErrors({});
  }

  function validateGuest(){
    const e:Record<string,string>={};
    if(checkout.firstName.trim().length<2)e.firstName='Enter the guest’s first name.';
    if(checkout.lastName.trim().length<2)e.lastName='Enter the guest’s last name.';
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(checkout.email))e.email='Enter a valid email address.';
    if(checkout.phone.replace(/\D/g,'').length<10)e.phone='Enter a valid phone number.';
    if(!checkout.country)e.country='Select a country or region.';
    setCheckoutErrors(e);
    return Object.keys(e).length===0;
  }

  function validatePayment(){
    const e:Record<string,string>={};
    if(checkout.paymentMethod==='card'){
      if(checkout.cardName.trim().length<3)e.cardName='Enter the name shown on the card.';
      if(cardDigits(checkout.cardNumber).length<13)e.cardNumber='Enter a valid card number.';
      if(!validExpiry(checkout.expiry))e.expiry='Enter a valid future expiry date.';
      if(!/^\d{3,4}$/.test(checkout.cvc))e.cvc='Enter a valid 3 or 4 digit security code.';
    }
    setCheckoutErrors(e);
    return Object.keys(e).length===0;
  }

  function confirmBooking(){
    if(!selected||!selectedHotel)return;
    if(!checkout.acceptPolicy){
      setCheckoutErrors({policy:'You must accept the cancellation and booking terms.'});
      return;
    }
    const totals=priceBreakdown(selectedHotel);
    const booking:Booking={
      id:`VG-${Math.floor(100000+Math.random()*900000)}`,
      destination:selected,hotel:selectedHotel,checkIn,checkOut,guests,
      ...totals,guestName:`${checkout.firstName} ${checkout.lastName}`,
      guestEmail:checkout.email,
      paymentMethod:checkout.paymentMethod==='card'?'Card ending '+cardDigits(checkout.cardNumber).slice(-4):'Pay at property',
      createdAt:new Date().toISOString(),status:'Confirmed'
    };
    setBookings(v=>[booking,...v]);
    setConfirmedBooking(booking);
    setCheckoutStep('confirmed');
    setCheckoutErrors({});
    notify('Booking confirmed. Your itinerary is ready.');
  }

  function resetCheckout(){
    setSelected(null);setSelectedHotel(null);setCheckoutStep('hotel');
    setCheckout(initialCheckout);setCheckoutErrors({});setConfirmedBooking(null);
  }

  function updateCheckout<K extends keyof CheckoutData>(key:K,value:CheckoutData[K]){
    setCheckout(current=>({...current,[key]:value}));
    setCheckoutErrors(current=>({...current,[key]:''}));
  }

  const regions=['All','Europe','Asia','North America','South America','Africa','Middle East','Oceania'];

  return <div>
    <header className="header">
      <div className="container nav">
        <button className="mobile" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
        <a className="brand" href="#">VOYAGR</a>
        <nav className={mobile?'links open':'links'}>
          <a href="#discover">Discover</a><a href="#stays">Stays</a><a href="#how">How it works</a>
        </nav>
        <div className="actions">
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label="Toggle theme">{theme==='dark'?<Sun/>:<Moon/>}</button>
          <button onClick={()=>setPanel('favorites')} aria-label="Saved destinations"><Heart/><span>{favorites.length||''}</span></button>
          <button className="trip-btn" onClick={()=>setPanel('trips')}><UserRound/>My trips</button>
        </div>
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Curated journeys · Thoughtful stays</p>
          <h1>Travel that feels<br/>designed for you.</h1>
          <p>Discover destinations worldwide, compare exceptional stays, and build a trip worth remembering.</p>

          <div className="search">
            <div className={`search-field location-field ${errors.location?'invalid':''}`} ref={locationRef}>
              <label><span><Globe2/>Where</span>
                <input
                  value={query}
                  onFocus={()=>setSuggestionsOpen(true)}
                  onChange={e=>{setQuery(e.target.value);setSuggestionsOpen(true);setErrors(c=>({...c,location:undefined}))}}
                  placeholder="Start typing a city or country"
                  autoComplete="off"
                />
              </label>
              {errors.location&&<small className="field-error">{errors.location}</small>}
              {suggestionsOpen&&<div className="suggestions">
                <div className="suggestions-title">Cities and countries</div>
                {locationSuggestions.length?locationSuggestions.map(d=><button key={d.id} onClick={()=>chooseLocation(d)}>
                  <img src={d.image} alt=""/>
                  <span><b>{d.city}</b><small>{d.country} · {d.region}</small></span>
                  <MapPin/>
                </button>):<p>No matching city or country.</p>}
              </div>}
            </div>

            <div className={`search-field ${errors.checkIn?'invalid':''}`}>
              <label onClick={()=>openCalendar(checkInRef)}><span><CalendarDays/>Check in</span>
                <input ref={checkInRef} type="date" min={todayISO()} max={futureISO(730)} value={checkIn} onChange={e=>onCheckIn(e.target.value)}/>
              </label>
              {errors.checkIn&&<small className="field-error">{errors.checkIn}</small>}
            </div>

            <div className={`search-field ${errors.checkOut?'invalid':''}`}>
              <label onClick={()=>openCalendar(checkOutRef)}><span><CalendarDays/>Check out</span>
                <input ref={checkOutRef} type="date" min={checkIn?futureISOFrom(checkIn,1):futureISO(1)} max={futureISO(760)} value={checkOut} onChange={e=>onCheckOut(e.target.value)}/>
              </label>
              {errors.checkOut&&<small className="field-error">{errors.checkOut}</small>}
            </div>

            <div className="search-field">
              <label><span><Users/>Guests</span>
                <select value={guests} onChange={e=>setGuests(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} guest{n>1?'s':''}</option>)}</select>
              </label>
            </div>
            <button className="search-button" onClick={handleSearch}><Search/>Search</button>
          </div>
          <p className="search-note"><CheckCircle2/> Valid dates are limited to the next two years. Check-out must be after check-in.</p>
        </div>
      </section>

      <section className="section container" id="discover">
        <div className="heading">
          <div><p className="eyebrow">Discover worldwide</p><h2>Places worth the journey.</h2><p>{filtered.length} destinations available across multiple regions.</p></div>
          <div className="tabs">{regions.map(r=><button className={region===r?'active':''} onClick={()=>setRegion(r)} key={r}>{r}</button>)}</div>
        </div>
        {filtered.length?<div className="grid">
          {filtered.map(d=><article className="card" key={d.id}>
            <div className="image"><img src={d.image} alt={`${d.city}, ${d.country}`}/><button className={favorites.includes(d.id)?'fav active':'fav'} onClick={()=>toggleFavorite(d.id)}><Heart/></button><span>{d.tag}</span></div>
            <div className="body"><div className="title"><div><h3>{d.city}</h3><p><MapPin/>{d.country}</p></div><b><Star/>{d.rating}</b></div><p>{d.description}</p><div className="foot"><div><small>Trip packages from</small><strong>${d.price}</strong></div><button onClick={()=>{setSelected(d);setSelectedHotel(null);setCheckoutStep('hotel');setCheckoutErrors({})}}>Explore stay</button></div></div>
          </article>)}
        </div>:<div className="no-results"><Globe2/><h3>No destinations match “{query}”</h3><p>Try a different city, country, or region, or choose an option from the search suggestions.</p><button onClick={()=>{setQuery('');setRegion('All')}}>Show all destinations</button></div>}
      </section>

      <section className="section feature" id="stays"><div className="container feature-grid"><div><p className="eyebrow">Stay differently</p><h2>Hotels selected for character, not just convenience.</h2><p>Every stay includes clear nightly pricing, amenities, ratings, and a complete demo booking flow.</p></div><img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85" alt="Luxury stay"/></div></section>

      <section className="section container" id="how"><div className="heading"><div><p className="eyebrow">Simple by design</p><h2>Plan in three steps.</h2></div></div><div className="steps"><article><span>01</span><h3>Search globally</h3><p>Type a city or country and select it from intelligent suggestions.</p></article><article><span>02</span><h3>Choose valid dates</h3><p>Use the calendar with real minimum, maximum, and check-out rules.</p></article><article><span>03</span><h3>Build your trip</h3><p>Compare stays, save favorites, and manage demo bookings.</p></article></div></section>
    </main>

    <footer><div className="container"><b className="brand">VOYAGR</b><p>React + TypeScript travel platform by Gourav Thakur.</p></div></footer>

    {selected&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget&&checkoutStep!=='confirmed')resetCheckout()}}>
      <div className="modal booking-flow">
        <button className="close" onClick={resetCheckout}><X/></button>

        {checkoutStep!=='confirmed'&&<div className="checkout-progress">
          {[['hotel','Choose stay'],['guest','Guest details'],['payment','Payment'],['review','Review']].map(([step,label],index)=>{
            const order=['hotel','guest','payment','review'];
            const active=order.indexOf(checkoutStep)>=index;
            return <div className={active?'active':''} key={step}><span>{index+1}</span><small>{label}</small></div>
          })}
        </div>}

        {checkoutStep==='hotel'&&<>
          <img className="modal-hero" src={selected.image} alt={selected.city}/>
          <div className="property-heading"><div><p className="eyebrow">{selected.region}</p><h2>{selected.city}, {selected.country}</h2><p>{selected.description}</p></div><div className="property-score"><Star/> {selected.rating}</div></div>
          <div className="booking-summary"><span><CalendarDays/>{checkIn} → {checkOut}</span><span><Users/>{guests} guest{guests>1?'s':''}</span><span>{nightsCount()} night{nightsCount()>1?'s':''}</span></div>
          <div className="policy-banner"><ShieldCheck/><div><b>Flexible booking</b><p>Free cancellation within 24 hours of this demo reservation.</p></div></div>
          <h3>Choose a room and rate</h3>
          {hotels.filter(h=>h.destinationId===selected.id).map(h=>{
            const total=priceBreakdown(h);
            return <article className="hotel detailed-hotel" key={h.id}>
              <img src={h.image} alt={h.name}/>
              <div><h4>{h.name}</h4><p><Star/>{h.rating} · {h.amenities.join(' · ')}</p><ul><li>One queen room</li><li>Free Wi‑Fi</li><li>{h.id%2?'Breakfast included':'Room only'}</li></ul></div>
              <div><strong>${h.price}</strong><small>per night</small><b>${total.total} total</b><small>includes taxes and fees</small><button onClick={()=>beginCheckout(selected,h)}>Reserve this room</button></div>
            </article>
          })}
        </>}

        {checkoutStep==='guest'&&selectedHotel&&<>
          <button className="back-link" onClick={()=>setCheckoutStep('hotel')}><ArrowLeft/>Back to rooms</button>
          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">Step 2 of 4</p><h2>Who is checking in?</h2><p className="muted-copy">Enter the lead guest’s information exactly as it appears on their identification.</p>
              <div className="form-grid">
                <Field label="First name" error={checkoutErrors.firstName}><input value={checkout.firstName} onChange={e=>updateCheckout('firstName',e.target.value)} autoComplete="given-name"/></Field>
                <Field label="Last name" error={checkoutErrors.lastName}><input value={checkout.lastName} onChange={e=>updateCheckout('lastName',e.target.value)} autoComplete="family-name"/></Field>
                <Field label="Email address" error={checkoutErrors.email}><div className="input-icon"><Mail/><input type="email" value={checkout.email} onChange={e=>updateCheckout('email',e.target.value)} autoComplete="email"/></div></Field>
                <Field label="Phone number" error={checkoutErrors.phone}><div className="input-icon"><Phone/><input value={checkout.phone} onChange={e=>updateCheckout('phone',e.target.value)} autoComplete="tel"/></div></Field>
                <Field label="Country or region" error={checkoutErrors.country} full><select value={checkout.country} onChange={e=>updateCheckout('country',e.target.value)}>
                  {['Canada','United States','United Kingdom','India','Australia','France','Germany','Italy','Japan','United Arab Emirates','Other'].map(c=><option key={c}>{c}</option>)}
                </select></Field>
                <Field label="Special requests (optional)" full><textarea rows={4} value={checkout.requests} onChange={e=>updateCheckout('requests',e.target.value)} placeholder="Accessibility needs, arrival details, room preferences..."/></Field>
              </div>
              <button className="primary-action" onClick={()=>{if(validateGuest())setCheckoutStep('payment')}}>Continue to payment</button>
            </section>
            <BookingSidebar hotel={selectedHotel} destination={selected} checkIn={checkIn} checkOut={checkOut} guests={guests} totals={priceBreakdown(selectedHotel)}/>
          </div>
        </>}

        {checkoutStep==='payment'&&selectedHotel&&<>
          <button className="back-link" onClick={()=>setCheckoutStep('guest')}><ArrowLeft/>Back to guest details</button>
          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">Step 3 of 4</p><h2>Choose how to pay</h2>
              <div className="payment-options">
                <label className={checkout.paymentMethod==='card'?'selected':''}><input type="radio" checked={checkout.paymentMethod==='card'} onChange={()=>updateCheckout('paymentMethod','card')}/><CreditCard/><div><b>Pay securely by card</b><p>Demo card details are validated but never charged or transmitted.</p></div></label>
                <label className={checkout.paymentMethod==='property'?'selected':''}><input type="radio" checked={checkout.paymentMethod==='property'} onChange={()=>updateCheckout('paymentMethod','property')}/><WalletCards/><div><b>Pay at property</b><p>Reserve now and pay the property during check-in.</p></div></label>
              </div>
              {checkout.paymentMethod==='card'&&<div className="form-grid card-form">
                <Field label="Name on card" error={checkoutErrors.cardName} full><input value={checkout.cardName} onChange={e=>updateCheckout('cardName',e.target.value)} autoComplete="cc-name"/></Field>
                <Field label="Card number" error={checkoutErrors.cardNumber} full><div className="input-icon"><CreditCard/><input inputMode="numeric" value={checkout.cardNumber} onChange={e=>updateCheckout('cardNumber',formatCard(e.target.value))} placeholder="4242 4242 4242 4242" autoComplete="cc-number"/></div></Field>
                <Field label="Expiry" error={checkoutErrors.expiry}><input inputMode="numeric" value={checkout.expiry} onChange={e=>updateCheckout('expiry',formatExpiry(e.target.value))} placeholder="MM/YY" autoComplete="cc-exp"/></Field>
                <Field label="CVC" error={checkoutErrors.cvc}><input inputMode="numeric" value={checkout.cvc} onChange={e=>updateCheckout('cvc',e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" autoComplete="cc-csc"/></Field>
              </div>}
              <div className="secure-note"><LockKeyhole/><span><b>Secure demo checkout</b><small>No real payment is processed. Card details stay in this browser state only.</small></span></div>
              <button className="primary-action" onClick={()=>{if(validatePayment())setCheckoutStep('review')}}>Review booking</button>
            </section>
            <BookingSidebar hotel={selectedHotel} destination={selected} checkIn={checkIn} checkOut={checkOut} guests={guests} totals={priceBreakdown(selectedHotel)}/>
          </div>
        </>}

        {checkoutStep==='review'&&selectedHotel&&<>
          <button className="back-link" onClick={()=>setCheckoutStep('payment')}><ArrowLeft/>Back to payment</button>
          <div className="checkout-layout">
            <section className="checkout-main">
              <p className="eyebrow">Step 4 of 4</p><h2>Review and confirm</h2>
              <div className="review-section"><h3>Guest</h3><p><b>{checkout.firstName} {checkout.lastName}</b><br/>{checkout.email}<br/>{checkout.phone}<br/>{checkout.country}</p><button onClick={()=>setCheckoutStep('guest')}>Edit</button></div>
              <div className="review-section"><h3>Payment</h3><p><b>{checkout.paymentMethod==='card'?'Card payment':'Pay at property'}</b><br/>{checkout.paymentMethod==='card'?`Card ending ${cardDigits(checkout.cardNumber).slice(-4)}`:'Payment due at check-in'}</p><button onClick={()=>setCheckoutStep('payment')}>Edit</button></div>
              <div className="review-section"><h3>Cancellation policy</h3><p>Free cancellation within 24 hours of this demo booking. After that, the first night is shown as non-refundable for demonstration.</p></div>
              <label className="terms-check"><input type="checkbox" checked={checkout.acceptPolicy} onChange={e=>updateCheckout('acceptPolicy',e.target.checked)}/><span>I agree to the booking terms, cancellation policy, and acknowledge that this is a portfolio demo.</span></label>
              {checkoutErrors.policy&&<p className="checkout-error">{checkoutErrors.policy}</p>}
              <button className="primary-action confirm-action" onClick={confirmBooking}><LockKeyhole/>Confirm booking · ${priceBreakdown(selectedHotel).total}</button>
            </section>
            <BookingSidebar hotel={selectedHotel} destination={selected} checkIn={checkIn} checkOut={checkOut} guests={guests} totals={priceBreakdown(selectedHotel)}/>
          </div>
        </>}

        {checkoutStep==='confirmed'&&confirmedBooking&&<div className="confirmation-screen">
          <div className="confirmation-icon"><CheckCircle2/></div>
          <p className="eyebrow">Reservation confirmed</p>
          <h2>You’re going to {confirmedBooking.destination.city}.</h2>
          <p>A demo confirmation has been created for <b>{confirmedBooking.guestEmail}</b>.</p>
          <div className="confirmation-card">
            <img src={confirmedBooking.hotel.image} alt={confirmedBooking.hotel.name}/>
            <div><span>Confirmation number</span><strong>{confirmedBooking.id}</strong><h3>{confirmedBooking.hotel.name}</h3><p>{confirmedBooking.checkIn} → {confirmedBooking.checkOut} · {confirmedBooking.guests} guest{confirmedBooking.guests>1?'s':''}</p></div>
            <div><span>Total</span><strong>${confirmedBooking.total}</strong><small>{confirmedBooking.paymentMethod}</small></div>
          </div>
          <div className="confirmation-actions"><button onClick={()=>{resetCheckout();setPanel('trips')}}>View My Trips</button><button onClick={resetCheckout}>Continue exploring</button></div>
        </div>}
      </div>
    </div>}

    {panel&&<><button className="drawer-overlay" onClick={()=>setPanel(null)}/><aside className="drawer"><div className="drawer-head"><h2>{panel==='favorites'?'Saved places':'My trips'}</h2><button onClick={()=>setPanel(null)}><X/></button></div>
      {panel==='favorites'?(favorites.length?destinations.filter(d=>favorites.includes(d.id)).map(d=><article className="saved" key={d.id}><img src={d.image} alt={d.city}/><div><h3>{d.city}</h3><p>{d.country}</p></div><button onClick={()=>toggleFavorite(d.id)}>Remove</button></article>):<p className="empty">No saved destinations yet.</p>)
      :(bookings.length?bookings.map(b=><article className="booking" key={b.id}><img src={b.destination.image} alt={b.destination.city}/><span>{b.id}</span><h3>{b.destination.city}</h3><p>{b.hotel.name}</p><small>{b.checkIn} → {b.checkOut}</small><strong>${b.total}</strong><button onClick={()=>setBookings(v=>v.filter(x=>x.id!==b.id))}>Cancel demo booking</button></article>):<p className="empty">No trips booked yet.</p>)}
    </aside></>}

    {toast&&<div className="toast">{toast}</div>}
  </div>
}


function Field({label,error,full,children}:{label:string;error?:string;full?:boolean;children:React.ReactNode}){
  return <label className={`checkout-field ${full?'full':''} ${error?'has-error':''}`}><span>{label}</span>{children}{error&&<small>{error}</small>}</label>
}

function BookingSidebar({hotel,destination,checkIn,checkOut,guests,totals}:{
  hotel:Hotel;destination:Destination;checkIn:string;checkOut:string;guests:number;
  totals:{subtotal:number;serviceFee:number;taxes:number;total:number}
}){
  return <aside className="booking-sidebar">
    <img src={hotel.image} alt={hotel.name}/>
    <p className="eyebrow">{destination.city}, {destination.country}</p>
    <h3>{hotel.name}</h3>
    <div className="sidebar-detail"><CalendarDays/><span><b>{checkIn} → {checkOut}</b><small>{Math.max(1,Math.ceil((new Date(checkOut).getTime()-new Date(checkIn).getTime())/86400000))} night stay</small></span></div>
    <div className="sidebar-detail"><Users/><span><b>{guests} guest{guests>1?'s':''}</b><small>Lead guest required</small></span></div>
    <div className="price-lines"><p><span>Room subtotal</span><b>${totals.subtotal}</b></p><p><span>Service fee</span><b>${totals.serviceFee}</b></p><p><span>Estimated taxes</span><b>${totals.taxes}</b></p><p className="total"><span>Total</span><b>${totals.total}</b></p></div>
    <small className="demo-caption">Portfolio demo — no real reservation or charge.</small>
  </aside>
}

function futureISOFrom(date:string,days:number){
  const d=new Date(`${date}T12:00:00`);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
}
