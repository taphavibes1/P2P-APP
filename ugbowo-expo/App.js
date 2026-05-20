import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Animated, Modal, Platform, SafeAreaView, FlatList,
  KeyboardAvoidingView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width: W } = Dimensions.get('window');
const G = '#1a6b3c';
const BG = '#f0faf4';

// ── Data ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, emoji:'📚', title:'CHM 101 Textbook',        price:2500,  seller:'Adaeze N.',  dist:'~150m', category:'Textbooks',    rating:4.8, condition:'Good',      desc:'Chemistry 101 textbook, one semester use. All pages intact. Perfect for 100-level students.' },
  { id:2, emoji:'💡', title:'Reading Lamp',             price:3800,  seller:'Tunde B.',   dist:'~200m', category:'Hostel Gear',  rating:4.5, condition:'Excellent', desc:'USB-powered LED lamp. Adjustable neck, 3 brightness levels. Selling because graduating.' },
  { id:3, emoji:'🍛', title:'Jollof Rice (plate)',      price:700,   seller:'Mama Ngozi', dist:'~80m',  category:'Food & Snacks',rating:4.9, condition:'Fresh',     desc:'Party jollof with fried chicken and plantain. Made fresh daily. Order before 2pm.' },
  { id:4, emoji:'👕', title:'UNIBEN Hoodie',            price:8500,  seller:'Emeka O.',   dist:'~300m', category:'Fashion',      rating:4.6, condition:'New',       desc:'Official UNIBEN hoodie, navy blue, size L. Bought two by mistake. Tags still on.' },
  { id:5, emoji:'🛏️', title:'Mattress Topper',          price:6000,  seller:'Chioma A.',  dist:'~120m', category:'Hostel Gear',  rating:4.3, condition:'Good',      desc:'4-inch foam topper. Makes hostel mattress comfortable. Moving off-campus.' },
  { id:6, emoji:'🔌', title:'Data Cable (Type-C)',      price:1200,  seller:'Bello I.',   dist:'~250m', category:'Electronics',  rating:4.7, condition:'New',       desc:'1.5m braided Type-C, fast charging compatible. Bought extras from bulk order.' },
  { id:7, emoji:'📖', title:'Biochem Practical Manual', price:1500,  seller:'Ngozi E.',   dist:'~180m', category:'Textbooks',    rating:4.4, condition:'Good',      desc:'BCH 305 Manual with all experiments. Minor pencil annotations, easily erasable.' },
  { id:8, emoji:'🩴', title:'Flip Flops (Size 42)',     price:900,   seller:'Kunle A.',   dist:'~90m',  category:'Fashion',      rating:4.2, condition:'Good',      desc:'Quality rubber flip flops, barely worn. Size 42. Great for hostel bathroom runs.' },
];

const CATEGORIES = ['All','Textbooks','Hostel Gear','Food & Snacks','Fashion','Electronics'];

const DEMO_CHATS = {
  1: [
    { from:'buyer', text:'Hi! Is the CHM 101 textbook still available?', time:'10:02 AM' },
    { from:'seller',text:'Yes! Just used one semester. All pages intact 📚', time:'10:04 AM' },
    { from:'buyer', text:'Any torn pages or writing inside?', time:'10:06 AM' },
    { from:'seller',text:'No torn pages. Just a little highlighter on chapter 3.', time:'10:08 AM' },
    { from:'buyer', text:"Can we meet today? I'm near Ekosodin.", time:'10:10 AM' },
  ],
};
const DEFAULT_CHAT = [
  { from:'buyer', text:'Hi! Is this item still available?', time:'11:00 AM' },
  { from:'seller',text:'Yes, still available! Come and get it 😊', time:'11:02 AM' },
  { from:'buyer', text:'What condition is it in?', time:'11:04 AM' },
  { from:'seller',text:'Almost as good as new. You\'ll be satisfied!', time:'11:06 AM' },
  { from:'buyer', text:'Can we meet at the Main Gate safe zone?', time:'11:08 AM' },
];

const PAY_METHODS = [
  { id:'card',     label:'Debit/Credit Card',  icon:'💳', desc:'Visa, Mastercard, Verve · Paystack' },
  { id:'transfer', label:'Bank Transfer',      icon:'🏦', desc:'GTBank, Access, Zenith & more' },
  { id:'ussd',     label:'USSD',               icon:'📱', desc:'Dial code from any phone' },
  { id:'qr',       label:'QR Code',            icon:'◼️', desc:'Scan with any banking app' },
  { id:'wallet',   label:'UniMart Wallet',     icon:'👛', desc:'Balance: ₦15,400' },
  { id:'crypto',   label:'Crypto (USDT)',      icon:'₿',  desc:'TRC-20 Network' },
];

// ── Utility Components ────────────────────────────────────────────────────

function Toast({ toast }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!toast) return;
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue:1, duration:260, useNativeDriver:true }),
      Animated.delay(2200),
      Animated.timing(anim, { toValue:0, duration:260, useNativeDriver:true }),
    ]).start();
  }, [toast?.id]);
  if (!toast) return null;
  return (
    <Animated.View style={[s.toast, {
      opacity: anim,
      transform:[{ translateY: anim.interpolate({ inputRange:[0,1], outputRange:[-8,0] }) }]
    }]}>
      <Text style={s.toastTxt}>✓  {toast.msg}</Text>
    </Animated.View>
  );
}

function Stars({ r }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ fontSize:12, color: i<=Math.floor(r)?'#facc15':'#d1d5db' }}>★</Text>
      ))}
      <Text style={{ fontSize:11, color:'#6b7280', marginLeft:3 }}>{r}</Text>
    </View>
  );
}

function VBadge() {
  return (
    <View style={s.vbadge}>
      <Text style={{ fontSize:10, color:G, fontWeight:'800' }}>✓ Verified</Text>
    </View>
  );
}

function EscrowBadge() {
  return (
    <View style={s.escrowBadge}>
      <Text style={{ fontSize:12, color:G, fontWeight:'700' }}>🛡️ Protected by UniMart Escrow</Text>
    </View>
  );
}

function QRViz({ size=120 }) {
  const cells = [];
  const rows = 9;
  for (let r=0; r<rows; r++) for (let c=0; c<rows; c++) {
    const corner = (r<3&&c<3)||(r<3&&c>=6)||(r>=6&&c<3);
    const dark = corner || ((r+c*3+r*c)%3===0 || (r*2+c)%5===1);
    cells.push(<View key={`${r}-${c}`} style={{ width:size/rows, height:size/rows, backgroundColor:dark?'#111':'#fff' }} />);
  }
  return (
    <View style={{ borderWidth:3, borderColor:'#111', borderRadius:6, flexDirection:'row', flexWrap:'wrap', width:size+6, height:size+6 }}>
      {cells}
    </View>
  );
}

function Countdown({ seconds:init }) {
  const [sec, setSec] = useState(init);
  useEffect(() => {
    if (sec<=0) return;
    const t = setTimeout(()=>setSec(x=>x-1), 1000);
    return ()=>clearTimeout(t);
  }, [sec]);
  const mm = String(Math.floor(sec/60)).padStart(2,'0');
  const ss = String(sec%60).padStart(2,'0');
  return <Text style={{ fontFamily:Platform.OS==='ios'?'Courier':'monospace', fontWeight:'800', color:G, fontSize:20 }}>{mm}:{ss}</Text>;
}

function BackBtn({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingRight:12, paddingVertical:4 }}>
      <Text style={{ color:'#fff', fontSize:28, fontWeight:'300', lineHeight:30 }}>‹</Text>
    </TouchableOpacity>
  );
}

// ── Splash ────────────────────────────────────────────────────────────────
function SplashScreen({ go }) {
  return (
    <LinearGradient colors={[G, '#145530']} style={{ flex:1, alignItems:'center', justifyContent:'space-between', paddingTop:80, paddingBottom:56, paddingHorizontal:32 }}>
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <View style={s.splashIcon}>
          <Text style={{ fontSize:52 }}>🛒</Text>
        </View>
        <Text style={{ color:'#fff', fontSize:52, fontWeight:'900', letterSpacing:-1, marginBottom:8 }}>UniMart</Text>
        <Text style={{ color:'#bbf7d0', fontSize:18, fontWeight:'600', marginBottom:4 }}>Buy. Sell. Stay Safe.</Text>
        <Text style={{ color:'#86efac', fontSize:13, marginBottom:32 }}>UNIBEN's own marketplace</Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap:8 }}>
          {['🎓 For UNIBEN Students','📍 Ugbowo Only','🛡️ Escrow Safe'].map(t => (
            <View key={t} style={s.chip}><Text style={{ color:'#bbf7d0', fontSize:12, fontWeight:'600' }}>{t}</Text></View>
          ))}
        </View>
      </View>
      <View style={{ width:'100%', gap:12 }}>
        <TouchableOpacity onPress={()=>go('login')} style={s.whiteBtn}>
          <Text style={{ color:G, fontWeight:'800', fontSize:17 }}>Get Started 🚀</Text>
        </TouchableOpacity>
        <Text style={{ color:'#86efac', fontSize:12, textAlign:'center' }}>Exclusively for UNIBEN students in Ugbowo</Text>
      </View>
    </LinearGradient>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────
function LoginScreen({ go, toast }) {
  const [tab, setTab]         = useState('login');
  const [email, setEmail]     = useState('');
  const [verified, setVerified] = useState(false);
  const [forgot, setForgot]   = useState(false);
  const [fe, setFe]           = useState('');

  const verify = () => {
    if (email.includes('@')) { setVerified(true); toast('Student verified ✓'); }
    else toast('Enter a valid student email first');
  };

  if (forgot) return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
      <LinearGradient colors={[G,'#145530']} style={s.header}>
        <SafeAreaView>
          <TouchableOpacity onPress={()=>setForgot(false)} style={{ marginBottom:12 }}>
            <Text style={{ color:'#86efac', fontSize:14, fontWeight:'600' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ color:'#fff', fontSize:22, fontWeight:'800' }}>Reset Password</Text>
          <Text style={{ color:'#bbf7d0', fontSize:13, marginTop:4 }}>We'll send a reset link to your UNIBEN email</Text>
        </SafeAreaView>
      </LinearGradient>
      <ScrollView style={{ flex:1, backgroundColor:BG }} contentContainerStyle={{ padding:24, gap:16 }}>
        <View>
          <Text style={s.label}>Student Email</Text>
          <TextInput style={s.input} placeholder="yourname@uniben.edu.ng" value={fe} onChangeText={setFe} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <TouchableOpacity onPress={()=>{ toast('Reset link sent! Check your email'); setForgot(false); }} style={s.greenBtn}>
          <Text style={s.greenBtnTxt}>Send Reset Link</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
      <LinearGradient colors={[G,'#145530']} style={s.header}>
        <SafeAreaView>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:20 }}>
            <View style={{ width:40,height:40,backgroundColor:'#fff',borderRadius:12,alignItems:'center',justifyContent:'center' }}>
              <Text style={{ fontSize:20 }}>🛒</Text>
            </View>
            <View>
              <Text style={{ color:'#fff', fontSize:20, fontWeight:'900' }}>UniMart</Text>
              <Text style={{ color:'#86efac', fontSize:11 }}>UNIBEN's Marketplace</Text>
            </View>
          </View>
          <View style={s.tabBar}>
            {['login','register'].map(t => (
              <TouchableOpacity key={t} onPress={()=>setTab(t)} style={[s.tabBtn, tab===t && s.tabBtnActive]}>
                <Text style={{ fontWeight:'700', fontSize:13, color:tab===t?G:'#fff' }}>
                  {t==='login'?'Log In':'Create Account'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={{ flex:1, backgroundColor:BG }} contentContainerStyle={{ padding:24, gap:14 }} keyboardShouldPersistTaps="handled">
        {tab==='register' && (
          <View><Text style={s.label}>Full Name</Text><TextInput style={s.input} placeholder="Chukwuemeka Obi" /></View>
        )}
        <View>
          <Text style={s.label}>Student Email</Text>
          <TextInput style={s.input} placeholder="yourname@uniben.edu.ng" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View>
          <Text style={s.label}>Password</Text>
          <TextInput style={s.input} placeholder="••••••••" secureTextEntry />
        </View>
        {tab==='register' && (
          <View><Text style={s.label}>Confirm Password</Text><TextInput style={s.input} placeholder="••••••••" secureTextEntry /></View>
        )}

        {verified
          ? <View style={s.verifiedBox}><Text style={{ color:'#15803d', fontWeight:'700', fontSize:14 }}>✓ Student identity verified</Text></View>
          : <TouchableOpacity onPress={verify} style={s.outlineBtn}><Text style={{ color:G, fontWeight:'800', fontSize:13 }}>🎓 Verify with Student ID</Text></TouchableOpacity>
        }

        <TouchableOpacity onPress={()=>go('home')} style={s.greenBtn}>
          <Text style={s.greenBtnTxt}>{tab==='login'?'Continue →':'Create Account →'}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
          <View style={{ flex:1, height:1, backgroundColor:'#e5e7eb' }}/>
          <Text style={{ fontSize:12, color:'#9ca3af', fontWeight:'600' }}>OR</Text>
          <View style={{ flex:1, height:1, backgroundColor:'#e5e7eb' }}/>
        </View>

        <TouchableOpacity onPress={()=>{ toast('Redirecting to Google...'); setTimeout(()=>go('home'),900); }} style={s.googleBtn}>
          <Text style={{ fontSize:18 }}>🌐</Text>
          <Text style={{ fontWeight:'700', fontSize:13, color:'#374151' }}> Continue with Google</Text>
        </TouchableOpacity>

        {tab==='login' && (
          <TouchableOpacity onPress={()=>setForgot(true)} style={{ alignSelf:'center', padding:8 }}>
            <Text style={{ color:G, fontWeight:'700', fontSize:13 }}>Forgot Password?</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Home Feed ─────────────────────────────────────────────────────────────
function HomeScreen({ go, toast }) {
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('All');

  const filtered = PRODUCTS.filter(p =>
    (cat==='All' || p.category===cat) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = ({ item:p }) => (
    <TouchableOpacity onPress={()=>go('product',p)} style={[s.card, { width:(W-48)/2 }]}>
      <View style={s.cardImg}><Text style={{ fontSize:36 }}>{p.emoji}</Text></View>
      <Text style={s.cardTitle} numberOfLines={2}>{p.title}</Text>
      <Text style={s.cardPrice}>₦{p.price.toLocaleString()}</Text>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <Text style={{ color:'#9ca3af', fontSize:10 }}>{p.dist}</Text>
        <VBadge />
      </View>
      <TouchableOpacity onPress={()=>go('product',p)} style={s.buyBtn}>
        <Text style={s.buyBtnTxt}>Buy</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.homeHeader}>
        <SafeAreaView>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <View>
              <Text style={{ color:'#86efac', fontSize:11 }}>📍 Ugbowo, Benin City</Text>
              <Text style={{ color:'#fff', fontSize:22, fontWeight:'900' }}>UniMart 🛒</Text>
            </View>
            <View style={{ flexDirection:'row', gap:8 }}>
              <TouchableOpacity style={s.iconCircle}><Text style={{ fontSize:16 }}>🔔</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>go('profile')} style={[s.iconCircle,{backgroundColor:'#fff'}]}>
                <Text style={{ color:G, fontWeight:'900', fontSize:12 }}>CO</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={s.searchBox}>
            <Text style={{ color:'#9ca3af', marginRight:8 }}>🔍</Text>
            <TextInput
              style={{ flex:1, fontSize:13, color:'#374151' }}
              placeholder="Search items near you..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow} contentContainerStyle={{ paddingHorizontal:16, gap:8, paddingVertical:10 }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} onPress={()=>setCat(c)} style={[s.catChip, cat===c && s.catChipActive]}>
            <Text style={{ fontSize:12, fontWeight:'700', color:cat===c?'#fff':'#6b7280' }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Banner */}
      <View style={s.banner}>
        <View>
          <Text style={{ color:'#fff', fontWeight:'800', fontSize:13 }}>🛡️ Safe Trading Zone</Text>
          <Text style={{ color:'#86efac', fontSize:11, marginTop:2 }}>All payments protected by escrow</Text>
        </View>
        <Text style={{ fontSize:28 }}>✅</Text>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderCard}
        keyExtractor={p=>String(p.id)}
        numColumns={2}
        columnWrapperStyle={{ gap:12, paddingHorizontal:16 }}
        contentContainerStyle={{ paddingTop:12, paddingBottom:100, gap:12 }}
        ListHeaderComponent={<Text style={{ color:'#9ca3af', fontSize:11, fontWeight:'700', paddingHorizontal:16, paddingBottom:4 }}>{filtered.length} items near you</Text>}
      />
    </View>
  );
}

// ── Product Detail ────────────────────────────────────────────────────────
function ProductScreen({ product:p, go }) {
  if (!p) return null;
  const initials = p.seller.split(' ').map(w=>w[0]).join('').slice(0,2);
  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.subHeader}>
        <SafeAreaView style={{ flexDirection:'row', alignItems:'center' }}>
          <BackBtn onPress={()=>go('home')} />
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:14, flex:1 }} numberOfLines={1}>{p.title}</Text>
          <TouchableOpacity><Text style={{ color:'#fff', fontSize:20 }}>♡</Text></TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding:16, gap:14, paddingBottom:40 }}>
        {/* Image block */}
        <View style={s.productImg}>
          <Text style={{ fontSize:96 }}>{p.emoji}</Text>
          <View style={s.conditionBadge}><Text style={{ color:'#16a34a', fontSize:12, fontWeight:'700' }}>{p.condition}</Text></View>
        </View>

        {/* Title & Price */}
        <View style={s.productCard}>
          <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between' }}>
            <View style={{ flex:1 }}>
              <Text style={{ fontWeight:'900', color:'#111827', fontSize:18, marginBottom:4 }}>{p.title}</Text>
              <Text style={{ color:G, fontWeight:'900', fontSize:26 }}>₦{p.price.toLocaleString()}</Text>
            </View>
            <VBadge />
          </View>
          <Text style={{ color:'#6b7280', fontSize:13, marginTop:12, lineHeight:20 }}>{p.desc}</Text>
        </View>

        {/* Seller */}
        <View style={s.productCard}>
          <Text style={s.sectionLabel}>Seller</Text>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
            <View style={s.avatar}><Text style={{ color:'#fff', fontWeight:'900', fontSize:14 }}>{initials}</Text></View>
            <View>
              <Text style={{ fontWeight:'700', color:'#1f2937', fontSize:15, marginBottom:4 }}>{p.seller}</Text>
              <Stars r={p.rating} />
              <View style={{ marginTop:4 }}><VBadge /></View>
            </View>
          </View>
        </View>

        {/* Safe zone */}
        <View style={s.safeZone}>
          <Text style={{ fontSize:24 }}>📍</Text>
          <View>
            <Text style={{ fontWeight:'700', color:G, fontSize:14, marginBottom:2 }}>Safe Zone Meeting Spot</Text>
            <Text style={{ color:'#15803d', fontSize:12 }}>Main Gate · Security Camera Area</Text>
          </View>
        </View>

        <EscrowBadge />

        <TouchableOpacity onPress={()=>go('chat',p)} style={s.outlineBtn}>
          <Text style={{ color:G, fontWeight:'700', fontSize:14 }}>💬 Chat with Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>go('payment',p)} style={s.greenBtn}>
          <Text style={s.greenBtnTxt}>🔒 Pay to Escrow – ₦{p.price.toLocaleString()}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ── Chat ──────────────────────────────────────────────────────────────────
function ChatScreen({ product:p, go, toast }) {
  const [msgs, setMsgs]         = useState(DEMO_CHATS[p?.id] || DEFAULT_CHAT);
  const [input, setInput]       = useState('');
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerVal, setOfferVal] = useState('');
  const listRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const t = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    setMsgs(m => [...m, { from:'buyer', text:input, time:t }]);
    setInput('');
    setTimeout(() => {
      setMsgs(m => [...m, { from:'seller', text:"Thanks! Let's meet at the safe zone 😊", time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    }, 1100);
  };

  const sendOffer = () => {
    if (!offerVal) return;
    setOfferOpen(false);
    const t = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    setMsgs(m => [...m, { from:'buyer', text:`💰 Offer: ₦${Number(offerVal).toLocaleString()}`, time:t }]);
    toast('Offer Sent! 💸');
    setTimeout(() => {
      setMsgs(m => [...m, { from:'seller', text:'Offer received! Let me think 🤔', time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    }, 1400);
  };

  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.subHeader}>
        <SafeAreaView style={{ flexDirection:'row', alignItems:'center' }}>
          <BackBtn onPress={()=>go('product',p)} />
          <View style={s.chatAvatar}>
            <Text style={{ color:G, fontWeight:'900', fontSize:11 }}>{p?.seller.split(' ').map(w=>w[0]).join('').slice(0,2)}</Text>
          </View>
          <View style={{ flex:1, marginLeft:10 }}>
            <Text style={{ color:'#fff', fontWeight:'700', fontSize:14 }}>{p?.seller}</Text>
            <Text style={{ color:'#86efac', fontSize:10 }}>● Online now</Text>
          </View>
          <TouchableOpacity onPress={()=>go('payment',p)} style={s.payQuickBtn}>
            <Text style={{ color:G, fontSize:11, fontWeight:'700' }}>Pay</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      {/* Item banner */}
      <View style={s.itemBanner}>
        <Text style={{ fontSize:14 }}>📦</Text>
        <Text style={{ color:'#92400e', fontSize:11, fontWeight:'700', marginLeft:8 }}>{p?.title} · ₦{p?.price?.toLocaleString()}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(_,i)=>String(i)}
        onContentSizeChange={()=>listRef.current?.scrollToEnd({ animated:true })}
        contentContainerStyle={{ padding:16, gap:10, paddingBottom:20 }}
        ListHeaderComponent={
          <View style={{ alignItems:'center', marginBottom:8 }}>
            <View style={s.dateBadge}><Text style={{ color:'#9ca3af', fontSize:11 }}>Today</Text></View>
          </View>
        }
        renderItem={({item:m}) => (
          <View style={{ flexDirection:'row', justifyContent:m.from==='buyer'?'flex-end':'flex-start' }}>
            <View style={[s.bubble, m.from==='buyer' ? s.bubbleBuyer : s.bubbleSeller]}>
              <Text style={{ color:m.from==='buyer'?'#fff':'#1f2937', fontSize:13, lineHeight:19 }}>{m.text}</Text>
              <Text style={{ fontSize:10, color:m.from==='buyer'?'#86efac':'#9ca3af', textAlign:'right', marginTop:3 }}>{m.time}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
        <View style={s.chatInput}>
          <TouchableOpacity onPress={()=>setOfferOpen(true)} style={s.offerBtn}>
            <Text style={{ color:G, fontSize:11, fontWeight:'700' }}>💰 Offer</Text>
          </TouchableOpacity>
          <TextInput
            style={s.msgInput}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={send} style={s.sendBtn}>
            <Text style={{ color:'#fff', fontSize:16 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Offer Modal */}
      <Modal visible={offerOpen} transparent animationType="slide" onRequestClose={()=>setOfferOpen(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={()=>setOfferOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ width:'100%' }}>
            <View style={s.modalSheet} onStartShouldSetResponder={()=>true}>
              <View style={s.sheetHandle} />
              <Text style={{ fontWeight:'900', fontSize:18, marginBottom:4 }}>Make an Offer</Text>
              <Text style={{ color:'#6b7280', fontSize:13, marginBottom:16 }}>Listed at ₦{p?.price?.toLocaleString()}</Text>
              <View style={s.priceInputWrap}>
                <Text style={{ color:'#9ca3af', fontWeight:'700', position:'absolute', left:16, zIndex:1 }}>₦</Text>
                <TextInput
                  style={[s.input, { paddingLeft:28 }]}
                  placeholder="Your offer"
                  keyboardType="numeric"
                  value={offerVal}
                  onChangeText={setOfferVal}
                />
              </View>
              <TouchableOpacity onPress={sendOffer} style={[s.greenBtn,{marginTop:8}]}>
                <Text style={s.greenBtnTxt}>Send Offer 💸</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Payment ───────────────────────────────────────────────────────────────
function PaymentScreen({ product:p, go, toast }) {
  const [method, setMethod] = useState(null);
  const [step,   setStep]   = useState('select'); // select | form | processing | success
  const [ref_]              = useState('UME-'+Math.random().toString(36).slice(2,8).toUpperCase());
  const spin                = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'processing') {
      Animated.loop(Animated.timing(spin, { toValue:1, duration:900, useNativeDriver:true })).start();
      setTimeout(() => { setStep('success'); toast('Payment Held in Escrow ✓'); }, 2200);
    }
  }, [step]);

  const spinDeg = spin.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] });

  if (step === 'processing') return (
    <View style={{ flex:1, backgroundColor:BG, alignItems:'center', justifyContent:'center', gap:20 }}>
      <Animated.View style={{ width:72, height:72, borderRadius:36, borderWidth:4, borderColor:'#e5e7eb', borderTopColor:G, transform:[{rotate:spinDeg}] }} />
      <Text style={{ fontSize:20, fontWeight:'900', color:'#111' }}>Processing Payment</Text>
      <Text style={{ fontSize:14, color:'#6b7280' }}>Securing funds in escrow...</Text>
    </View>
  );

  if (step === 'success') return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.subHeader}>
        <SafeAreaView><Text style={{ color:'#fff', fontWeight:'700', fontSize:16 }}>Escrow Payment</Text></SafeAreaView>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding:24, alignItems:'center', gap:20 }}>
        <View style={s.successIcon}><Text style={{ fontSize:48 }}>✅</Text></View>
        <View style={{ alignItems:'center' }}>
          <Text style={{ fontSize:22, fontWeight:'900', color:'#111', marginBottom:8 }}>Payment Held in Escrow</Text>
          <Text style={{ fontSize:13, color:'#6b7280', textAlign:'center', lineHeight:20 }}>Your money is safe. Funds release when seller shows QR at pickup.</Text>
        </View>
        <View style={s.receiptCard}>
          {[['Item',p?.title],['Amount','₦'+p?.price?.toLocaleString()],['Escrow Ref',ref_],['Status','🔒 In Escrow']].map(([k,v]) => (
            <View key={k} style={s.receiptRow}>
              <Text style={{ fontSize:13, color:'#6b7280' }}>{k}</Text>
              <Text style={{ fontSize:13, fontWeight:'700', color:k==='Amount'?G:'#111', flex:1, textAlign:'right' }} numberOfLines={1}>{v}</Text>
            </View>
          ))}
        </View>
        <View style={s.qrCard}>
          <Text style={{ fontSize:13, fontWeight:'800', color:'#1e40af', marginBottom:10 }}>🤝 Pickup QR Code</Text>
          <QRViz size={100} />
          <Text style={{ fontSize:12, fontWeight:'700', color:'#1d4ed8', marginTop:8 }}>Scan at meetup</Text>
          <Text style={{ fontSize:11, color:'#3b82f6', marginTop:2 }}>Show to seller at Main Gate safe zone</Text>
        </View>
        <View style={s.refundNote}><Text style={{ fontSize:12, color:'#9a3412', fontWeight:'700' }}>⏰ Auto-refund in 48 hours if pickup doesn't happen</Text></View>
        <EscrowBadge />
        <TouchableOpacity onPress={()=>go('home')} style={[s.greenBtn,{width:'100%'}]}>
          <Text style={s.greenBtnTxt}>Back to Home 🏠</Text>
        </TouchableOpacity>
        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.subHeader}>
        <SafeAreaView style={{ flexDirection:'row', alignItems:'center' }}>
          <BackBtn onPress={step==='form'?()=>setStep('select'):()=>go('product',p)} />
          <Text style={{ color:'#fff', fontWeight:'700', fontSize:16 }}>Escrow Payment</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding:16, gap:14 }}>
        {/* Order summary */}
        <View style={s.summaryCard}>
          <Text style={s.sectionLabel}>Order Summary</Text>
          <View style={{ flexDirection:'row', alignItems:'center', gap:14 }}>
            <View style={s.summaryEmoji}><Text style={{ fontSize:28 }}>{p?.emoji}</Text></View>
            <View>
              <Text style={{ fontWeight:'700', color:'#1f2937', fontSize:14, marginBottom:2 }}>{p?.title}</Text>
              <Text style={{ color:G, fontWeight:'900', fontSize:18 }}>₦{p?.price?.toLocaleString()}</Text>
            </View>
          </View>
          <View style={s.summaryFooter}>
            <EscrowBadge />
            <Text style={{ fontSize:11, color:'#9ca3af' }}>+ ₦0 fee</Text>
          </View>
        </View>

        {step === 'select' && (
          <>
            <Text style={s.sectionLabel}>Choose Payment Method</Text>
            {PAY_METHODS.map(m => (
              <TouchableOpacity key={m.id} onPress={()=>{ setMethod(m.id); setStep('form'); }} style={s.methodRow}>
                <Text style={{ fontSize:26, width:36, textAlign:'center' }}>{m.icon}</Text>
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:'700', color:'#1f2937', fontSize:14, marginBottom:2 }}>{m.label}</Text>
                  <Text style={{ color:'#9ca3af', fontSize:11 }}>{m.desc}</Text>
                </View>
                <Text style={{ color:'#d1d5db', fontSize:20 }}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 'form' && (
          <View style={s.formCard}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:18 }}>
              <Text style={{ fontSize:22 }}>{PAY_METHODS.find(m=>m.id===method)?.icon}</Text>
              <Text style={{ fontWeight:'700', color:'#1f2937', fontSize:15 }}>{PAY_METHODS.find(m=>m.id===method)?.label}</Text>
            </View>
            <PaymentForm method={method} product={p} onSuccess={()=>setStep('processing')} />
          </View>
        )}
        <View style={{ height:40 }} />
      </ScrollView>
    </View>
  );
}

function PaymentForm({ method, product:p, onSuccess }) {
  const [cardNum, setCardNum] = useState('');
  const [expiry,  setExpiry]  = useState('');
  const [cvv,     setCvv]     = useState('');
  const [name,    setName]    = useState('');
  const [bank,    setBank]    = useState('GTBank (*737#)');
  const [pin,     setPin]     = useState(['','','','']);
  const pinRefs = [useRef(),useRef(),useRef(),useRef()];

  const fmtCard = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExp  = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3?d.slice(0,2)+'/'+d.slice(2):d; };

  const handlePin = (i, v) => {
    const p=[...pin]; p[i]=v.slice(-1); setPin(p);
    if (v && i<3) pinRefs[i+1].current?.focus();
    if (p.every(d=>d!=='')) setTimeout(onSuccess,700);
  };

  if (method === 'card') return (
    <View style={{ gap:14 }}>
      {/* Mini card visual */}
      <LinearGradient colors={[G,'#145530']} style={s.cardVisual}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:20 }}>
          <Text style={{ color:'#86efac', fontSize:11, fontWeight:'600' }}>UniMart Card</Text>
          <View style={{ flexDirection:'row' }}>
            <View style={{ width:22,height:22,backgroundColor:'#facc15',borderRadius:11,opacity:.9 }}/>
            <View style={{ width:22,height:22,backgroundColor:'#ca8a04',borderRadius:11,opacity:.6,marginLeft:-8 }}/>
          </View>
        </View>
        <Text style={{ color:'#fff',fontFamily:Platform.OS==='ios'?'Courier':'monospace',fontSize:15,letterSpacing:2,marginBottom:12 }}>
          {cardNum||'•••• •••• •••• ••••'}
        </Text>
        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
          <View><Text style={{ color:'#86efac',fontSize:9 }}>CARD HOLDER</Text><Text style={{ color:'#fff',fontSize:13,fontWeight:'700' }}>{name||'YOUR NAME'}</Text></View>
          <View><Text style={{ color:'#86efac',fontSize:9 }}>EXPIRES</Text><Text style={{ color:'#fff',fontSize:13,fontWeight:'700' }}>{expiry||'MM/YY'}</Text></View>
        </View>
      </LinearGradient>
      <View><Text style={s.label}>Card Number</Text><TextInput style={[s.input,{fontFamily:Platform.OS==='ios'?'Courier':'monospace'}]} placeholder="0000 0000 0000 0000" value={cardNum} onChangeText={v=>setCardNum(fmtCard(v))} keyboardType="numeric" maxLength={19}/></View>
      <View><Text style={s.label}>Name on Card</Text><TextInput style={s.input} placeholder="Chukwuemeka Obi" value={name} onChangeText={setName}/></View>
      <View style={{ flexDirection:'row', gap:12 }}>
        <View style={{ flex:1 }}><Text style={s.label}>Expiry</Text><TextInput style={[s.input,{fontFamily:Platform.OS==='ios'?'Courier':'monospace'}]} placeholder="MM/YY" value={expiry} onChangeText={v=>setExpiry(fmtExp(v))} keyboardType="numeric" maxLength={5}/></View>
        <View style={{ width:100 }}><Text style={s.label}>CVV</Text><TextInput style={[s.input,{fontFamily:Platform.OS==='ios'?'Courier':'monospace'}]} placeholder="•••" secureTextEntry value={cvv} onChangeText={v=>setCvv(v.slice(0,3))} keyboardType="numeric" maxLength={3}/></View>
      </View>
      <Text style={{ fontSize:11, color:'#9ca3af' }}>🔒 Secured by Paystack · 256-bit SSL</Text>
      <TouchableOpacity onPress={onSuccess} style={s.greenBtn}>
        <Text style={s.greenBtnTxt}>Pay ₦{p?.price?.toLocaleString()} to Escrow</Text>
      </TouchableOpacity>
    </View>
  );

  if (method === 'transfer') return (
    <View style={{ gap:14 }}>
      <View style={s.transferBox}>
        <Text style={{ fontSize:11,color:'#3b82f6',fontWeight:'700',marginBottom:2 }}>Transfer exactly</Text>
        <Text style={{ fontSize:30,fontWeight:'900',color:'#111',marginBottom:2 }}>₦{p?.price?.toLocaleString()}</Text>
        <Text style={{ fontSize:11,color:'#6b7280',marginBottom:14 }}>to this virtual account</Text>
        <View style={s.acctBox}>
          <Text style={{ fontFamily:Platform.OS==='ios'?'Courier':'monospace',fontWeight:'900',fontSize:24,color:'#111',marginBottom:4 }}>0123456789</Text>
          <Text style={{ fontSize:13,color:'#6b7280' }}>UniMart Escrow — Wema Bank</Text>
        </View>
        <Text style={{ fontSize:12,color:'#ea580c',fontWeight:'700',marginTop:10 }}>⏰ Expires in 30 minutes</Text>
      </View>
      <Text style={s.sectionLabel}>Open your banking app</Text>
      <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        {[['GTBank','#f97316'],['Access','#ef4444'],['Zenith','#2563eb'],['OPay','#22c55e'],['Kuda','#7c3aed']].map(([nm,bg]) => (
          <TouchableOpacity key={nm} onPress={onSuccess} style={{ alignItems:'center', gap:6 }}>
            <View style={{ width:50,height:50,backgroundColor:bg,borderRadius:16,alignItems:'center',justifyContent:'center' }}><Text style={{ fontSize:22 }}>🏦</Text></View>
            <Text style={{ fontSize:10,color:'#6b7280',fontWeight:'600' }}>{nm}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={onSuccess} style={s.outlineBtn}><Text style={{ color:G,fontWeight:'700',fontSize:13 }}>I've Completed the Transfer ✓</Text></TouchableOpacity>
    </View>
  );

  if (method === 'ussd') return (
    <View style={{ gap:14 }}>
      <Text style={s.label}>Select Your Bank</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap:8 }}>
        {['GTBank (*737#)','Access (*901#)','Zenith (*966#)','UBA (*919#)','First Bank (*894#)'].map(b=>(
          <TouchableOpacity key={b} onPress={()=>setBank(b)} style={[s.catChip, bank===b&&s.catChipActive]}>
            <Text style={{ fontSize:11,fontWeight:'700',color:bank===b?'#fff':'#6b7280' }}>{b}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ backgroundColor:'#111827',borderRadius:20,padding:20,alignItems:'center' }}>
        <Text style={{ color:'#6b7280',fontSize:12,marginBottom:8 }}>Dial this code on your phone</Text>
        <Text style={{ color:'#4ade80',fontFamily:Platform.OS==='ios'?'Courier':'monospace',fontSize:22,fontWeight:'900',marginBottom:8 }}>*737*2550*12345#</Text>
        <Text style={{ color:'#4b5563',fontSize:12 }}>Amount: ₦{p?.price?.toLocaleString()}</Text>
      </View>
      {['Dial the code above','Enter your bank PIN when prompted',`Confirm ₦${p?.price?.toLocaleString()} payment`,'Come back and tap confirm below'].map((step,i)=>(
        <View key={i} style={{ flexDirection:'row',alignItems:'flex-start',gap:12 }}>
          <View style={{ width:22,height:22,backgroundColor:G,borderRadius:11,alignItems:'center',justifyContent:'center' }}><Text style={{ color:'#fff',fontSize:11,fontWeight:'700' }}>{i+1}</Text></View>
          <Text style={{ fontSize:13,color:'#374151',flex:1,lineHeight:18 }}>{step}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={onSuccess} style={s.greenBtn}><Text style={s.greenBtnTxt}>I've Completed the Payment ✓</Text></TouchableOpacity>
    </View>
  );

  if (method === 'qr') return (
    <View style={{ gap:16, alignItems:'center' }}>
      <Text style={{ fontSize:13,color:'#6b7280' }}>Scan with any Nigerian banking app</Text>
      <QRViz size={160} />
      <View style={{ flexDirection:'row',alignItems:'center',gap:8 }}>
        <Text style={{ fontSize:14,color:'#6b7280' }}>Expires in:</Text>
        <Countdown seconds={900} />
      </View>
      <View style={{ width:'100%',backgroundColor:'#f9fafb',borderRadius:18,padding:16,alignItems:'center' }}>
        <Text style={{ fontSize:13,fontWeight:'700',color:'#374151',marginBottom:4 }}>Amount to Pay</Text>
        <Text style={{ fontSize:30,fontWeight:'900',color:G,marginBottom:4 }}>₦{p?.price?.toLocaleString()}</Text>
        <Text style={{ fontSize:11,color:'#9ca3af' }}>UniMart Escrow Account</Text>
      </View>
      <TouchableOpacity onPress={onSuccess} style={[s.greenBtn,{width:'100%'}]}><Text style={s.greenBtnTxt}>I've Scanned & Paid ✓</Text></TouchableOpacity>
    </View>
  );

  if (method === 'wallet') return (
    <View style={{ gap:16 }}>
      <LinearGradient colors={[G,'#145530']} style={{ borderRadius:20,padding:20 }}>
        <Text style={{ fontSize:12,color:'#86efac',fontWeight:'600',marginBottom:4 }}>UniMart Wallet Balance</Text>
        <Text style={{ fontSize:36,fontWeight:'900',color:'#fff',marginBottom:14 }}>₦15,400</Text>
        <View style={{ paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,.2)',flexDirection:'row',justifyContent:'space-between' }}>
          <View><Text style={{ fontSize:10,color:'#86efac',marginBottom:2 }}>Paying</Text><Text style={{ color:'#fff',fontWeight:'700',fontSize:14 }}>₦{p?.price?.toLocaleString()}</Text></View>
          <View><Text style={{ fontSize:10,color:'#86efac',marginBottom:2 }}>Remaining</Text><Text style={{ color:'#fff',fontWeight:'700',fontSize:14 }}>₦{(15400-(p?.price||0)).toLocaleString()}</Text></View>
        </View>
      </LinearGradient>
      <Text style={{ fontSize:14,fontWeight:'700',color:'#374151',textAlign:'center' }}>Enter 4-digit PIN</Text>
      <View style={{ flexDirection:'row',justifyContent:'center',gap:14 }}>
        {pin.map((d,i)=>(
          <TextInput key={i} ref={pinRefs[i]} value={d} onChangeText={v=>handlePin(i,v)} keyboardType="numeric" maxLength={1} secureTextEntry
            style={{ width:56,height:56,borderWidth:2,borderColor:'#e5e7eb',borderRadius:16,textAlign:'center',fontSize:24,fontWeight:'900',backgroundColor:'#f9fafb' }} />
        ))}
      </View>
    </View>
  );

  if (method === 'crypto') {
    const usdt = ((p?.price||0)/1650).toFixed(2);
    return (
      <View style={{ gap:14 }}>
        <View style={{ backgroundColor:'#fffbeb',borderColor:'#fde68a',borderWidth:1,borderRadius:14,padding:12 }}>
          <Text style={{ fontSize:12,color:'#92400e',fontWeight:'700' }}>⚠️ Only send USDT on TRC-20 network. Other networks = permanent loss.</Text>
        </View>
        <View style={{ backgroundColor:'#f9fafb',borderRadius:18,padding:16,gap:10 }}>
          {[['Amount (Naira)','₦'+p?.price?.toLocaleString()],['Exchange Rate','₦1,650 / USDT'],['Send USDT',usdt+' USDT']].map(([k,v])=>(
            <View key={k} style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'center' }}>
              <Text style={{ fontSize:13,color:'#6b7280' }}>{k}</Text>
              <Text style={{ fontSize:k==='Send USDT'?20:13,fontWeight:k==='Send USDT'?'900':'700',color:k==='Send USDT'?G:'#111' }}>{v}</Text>
            </View>
          ))}
        </View>
        <View style={{ alignItems:'center',gap:12 }}>
          <QRViz size={130} />
          <View style={{ width:'100%',backgroundColor:'#111827',borderRadius:14,padding:14 }}>
            <Text style={{ fontSize:10,color:'#6b7280',marginBottom:4 }}>TRC-20 Wallet Address</Text>
            <Text style={{ fontFamily:Platform.OS==='ios'?'Courier':'monospace',color:'#4ade80',fontSize:11 }}>TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onSuccess} style={s.greenBtn}><Text style={s.greenBtnTxt}>I've Sent the Payment ✓</Text></TouchableOpacity>
      </View>
    );
  }
  return null;
}

// ── Sell ──────────────────────────────────────────────────────────────────
function SellScreen({ go, toast }) {
  const [name,  setName]  = useState('');
  const [cat,   setCat]   = useState('Textbooks');
  const [price, setPrice] = useState('');
  const [desc,  setDesc]  = useState('');
  const [photo, setPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const post = () => {
    if (!name || !price) { toast('Fill in name and price first'); return; }
    setLoading(true);
    setTimeout(() => { toast('Listing Live! 🎉'); setLoading(false); go('home'); }, 1500);
  };

  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={s.header}>
        <SafeAreaView>
          <Text style={{ color:'#fff', fontWeight:'900', fontSize:22, marginBottom:4 }}>Create Listing</Text>
          <Text style={{ color:'#86efac', fontSize:12 }}>Sell to students near you</Text>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
        <ScrollView contentContainerStyle={{ padding:20, gap:16 }} keyboardShouldPersistTaps="handled">
          <View style={s.geoChip}><Text style={{ fontSize:12,fontWeight:'700',color:'#15803d' }}>📍 You're in Ugbowo Zone ✓</Text></View>

          <TouchableOpacity onPress={()=>setPhoto(true)} style={[s.photoUpload, photo && s.photoUploadDone]}>
            <Text style={{ fontSize:36,color:photo?undefined:'#d1d5db' }}>{photo?'📸':'📷'}</Text>
            <Text style={{ fontSize:14,fontWeight:'600',color:photo?'#16a34a':'#9ca3af' }}>{photo?'Photo Added ✓':'Tap to Upload Photo'}</Text>
          </TouchableOpacity>

          <View><Text style={s.label}>Item Name *</Text><TextInput style={s.input} placeholder="e.g. CHM 101 Textbook" value={name} onChangeText={setName}/></View>

          <View>
            <Text style={s.label}>Category *</Text>
            <TouchableOpacity onPress={()=>setShowCatPicker(true)} style={[s.input,{justifyContent:'center'}]}>
              <Text style={{ fontSize:14,color:'#374151' }}>{cat}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={s.label}>Price (₦) *</Text>
            <View style={{ position:'relative' }}>
              <Text style={{ position:'absolute',left:16,top:14,color:'#9ca3af',fontWeight:'700',zIndex:1 }}>₦</Text>
              <TextInput style={[s.input,{paddingLeft:32}]} placeholder="0" keyboardType="numeric" value={price} onChangeText={setPrice}/>
            </View>
          </View>

          <View>
            <Text style={s.label}>Description</Text>
            <TextInput style={[s.input,{height:100,textAlignVertical:'top',paddingTop:12}]} placeholder="Describe condition, why selling..." multiline value={desc} onChangeText={setDesc}/>
          </View>

          <TouchableOpacity onPress={post} disabled={loading} style={[s.greenBtn, loading && { opacity:.7 }]}>
            <Text style={s.greenBtnTxt}>{loading?'Posting...':'Post Listing 🚀'}</Text>
          </TouchableOpacity>
          <View style={{ height:40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showCatPicker} transparent animationType="slide" onRequestClose={()=>setShowCatPicker(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={()=>setShowCatPicker(false)}>
          <View style={s.modalSheet} onStartShouldSetResponder={()=>true}>
            <View style={s.sheetHandle}/>
            <Text style={{ fontWeight:'900',fontSize:18,marginBottom:16 }}>Select Category</Text>
            {CATEGORIES.filter(c=>c!=='All').map(c=>(
              <TouchableOpacity key={c} onPress={()=>{ setCat(c); setShowCatPicker(false); }}
                style={{ paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6',flexDirection:'row',alignItems:'center',justifyContent:'space-between' }}>
                <Text style={{ fontSize:15,color:'#374151',fontWeight:cat===c?'700':'400' }}>{c}</Text>
                {cat===c && <Text style={{ color:G,fontWeight:'700' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────
function ProfileScreen({ go, toast }) {
  const [notif, setNotif] = useState(true);

  return (
    <View style={{ flex:1, backgroundColor:BG }}>
      <LinearGradient colors={[G,'#1d7a44']} style={[s.header,{alignItems:'center',paddingBottom:24}]}>
        <SafeAreaView style={{ alignItems:'center', width:'100%' }}>
          <View style={s.profileAvatar}><Text style={{ color:G,fontWeight:'900',fontSize:24 }}>CO</Text></View>
          <Text style={{ color:'#fff',fontSize:20,fontWeight:'900',marginBottom:4 }}>Chukwuemeka Obi</Text>
          <Text style={{ color:'#86efac',fontSize:12,marginBottom:8 }}>chukwuemeka@uniben.edu.ng</Text>
          <VBadge />
          <View style={{ marginTop:8 }}><Stars r={4.7} /></View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom:100 }}>
        {/* Stats */}
        <View style={s.statsRow}>
          {[['12','Items Sold'],['3','Active'],['2023','Since']].map(([v,l],i)=>(
            <View key={l} style={[s.statCell, i<2&&{borderRightWidth:1,borderRightColor:'#f3f4f6'}]}>
              <Text style={{ color:G,fontWeight:'900',fontSize:22,marginBottom:2 }}>{v}</Text>
              <Text style={{ color:'#9ca3af',fontSize:11 }}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={{ padding:16, gap:16 }}>
          {/* My Listings */}
          <View>
            <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
              <Text style={{ fontWeight:'900',color:'#111',fontSize:16 }}>My Listings</Text>
              <TouchableOpacity onPress={()=>go('sell')} style={s.newListingBtn}>
                <Text style={{ color:G,fontSize:12,fontWeight:'700' }}>+ New</Text>
              </TouchableOpacity>
            </View>
            {[{emoji:'📚',title:'MTH 201 Textbook',price:2000},{emoji:'🖥️',title:'Laptop Stand',price:4500}].map((item,i)=>(
              <View key={i} style={[s.listingCard,{marginBottom:10}]}>
                <View style={s.listingEmoji}><Text style={{ fontSize:26 }}>{item.emoji}</Text></View>
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:'700',color:'#1f2937',fontSize:14,marginBottom:2 }}>{item.title}</Text>
                  <Text style={{ color:G,fontWeight:'900',fontSize:14,marginBottom:4 }}>₦{item.price.toLocaleString()}</Text>
                  <View style={s.activeBadge}><Text style={{ color:'#16a34a',fontSize:11,fontWeight:'700' }}>● Active</Text></View>
                </View>
                <TouchableOpacity><Text style={{ color:'#d1d5db',fontSize:20 }}>⋮</Text></TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Settings */}
          <View style={s.settingsCard}>
            <Text style={[s.sectionLabel,{paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'}]}>Settings</Text>
            <View style={s.settingsRow}>
              <Text style={{ fontSize:18,marginRight:12 }}>🔔</Text>
              <Text style={{ fontSize:14,fontWeight:'600',color:'#374151',flex:1 }}>Push Notifications</Text>
              <TouchableOpacity onPress={()=>setNotif(n=>!n)} style={[s.toggle, notif&&{backgroundColor:G}]}>
                <Animated.View style={[s.toggleThumb,{transform:[{translateX:notif?22:2}]}]}/>
              </TouchableOpacity>
            </View>
            {[['🛡️','Privacy & Safety'],['💬','Chat Settings'],['🏦','Payment Methods'],['❓','Help & Support']].map(([ic,lb])=>(
              <TouchableOpacity key={lb} style={s.settingsRow}>
                <Text style={{ fontSize:18,marginRight:12 }}>{ic}</Text>
                <Text style={{ fontSize:14,fontWeight:'600',color:'#374151',flex:1 }}>{lb}</Text>
                <Text style={{ color:'#d1d5db',fontSize:18 }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={()=>{ toast('Logged out'); setTimeout(()=>go('splash'),500); }} style={s.logoutBtn}>
            <Text style={{ color:'#dc2626',fontWeight:'700',fontSize:14 }}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────
function BottomNav({ screen, go }) {
  if (['splash','login'].includes(screen)) return null;
  return (
    <View style={s.bottomNav}>
      {[['home','🏠','Home'],['sell','➕','Sell'],['chat','💬','Chat'],['profile','👤','Profile']].map(([id,icon,label])=>(
        <TouchableOpacity key={id} onPress={()=>go(id)} style={s.navItem}>
          <Text style={{ fontSize:22 }}>{icon}</Text>
          <Text style={{ fontSize:10, fontWeight:'700', color:screen===id?G:'#9ca3af' }}>{label}</Text>
          {screen===id && <View style={{ width:4,height:4,backgroundColor:G,borderRadius:2 }}/>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,  setScreen]  = useState('splash');
  const [product, setProduct] = useState(null);
  const [toast,   setToast]   = useState(null);
  const toastId = useRef(0);

  const showToast = (msg) => {
    toastId.current++;
    setToast({ msg, id: toastId.current });
  };
  const go = (s, p = null) => {
    if (p) setProduct(p);
    setScreen(s);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':   return <SplashScreen go={go} />;
      case 'login':    return <LoginScreen  go={go} toast={showToast} />;
      case 'home':     return <HomeScreen   go={go} toast={showToast} />;
      case 'product':  return <ProductScreen product={product} go={go} />;
      case 'chat':     return <ChatScreen    product={product} go={go} toast={showToast} />;
      case 'payment':  return <PaymentScreen product={product} go={go} toast={showToast} />;
      case 'sell':     return <SellScreen    go={go} toast={showToast} />;
      case 'profile':  return <ProfileScreen go={go} toast={showToast} />;
      default:         return <HomeScreen   go={go} toast={showToast} />;
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:G }}>
      <StatusBar style="light" />
      <Toast toast={toast} />
      {renderScreen()}
      <BottomNav screen={screen} go={go} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Toast
  toast:        { position:'absolute',top:56,alignSelf:'center',zIndex:999,backgroundColor:G,borderRadius:20,paddingHorizontal:20,paddingVertical:12,flexDirection:'row',alignItems:'center',elevation:10,shadowColor:G,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:8 },
  toastTxt:     { color:'#fff',fontWeight:'700',fontSize:14 },
  // Badges
  vbadge:       { flexDirection:'row',alignItems:'center',gap:4,backgroundColor:BG,borderColor:G,borderWidth:1,borderRadius:99,paddingHorizontal:8,paddingVertical:2,alignSelf:'flex-start' },
  escrowBadge:  { flexDirection:'row',alignItems:'center',gap:6,backgroundColor:BG,borderColor:'#bbf7d0',borderWidth:1,borderRadius:10,paddingHorizontal:12,paddingVertical:6,alignSelf:'flex-start' },
  // Splash
  splashIcon:   { width:96,height:96,backgroundColor:'#fff',borderRadius:28,alignItems:'center',justifyContent:'center',marginBottom:24,shadowColor:'#000',shadowOffset:{width:0,height:10},shadowOpacity:0.2,shadowRadius:20,elevation:10 },
  chip:         { backgroundColor:'rgba(255,255,255,.15)',borderRadius:99,paddingHorizontal:14,paddingVertical:6 },
  // Buttons
  whiteBtn:     { backgroundColor:'#fff',borderRadius:20,paddingVertical:16,alignItems:'center',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.15,shadowRadius:10,elevation:4 },
  greenBtn:     { backgroundColor:G,borderRadius:20,paddingVertical:15,alignItems:'center',shadowColor:G,shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:10,elevation:4 },
  greenBtnTxt:  { color:'#fff',fontWeight:'800',fontSize:15 },
  outlineBtn:   { borderWidth:2,borderColor:G,backgroundColor:'#fff',borderRadius:20,paddingVertical:14,alignItems:'center' },
  googleBtn:    { borderWidth:2,borderColor:'#e5e7eb',backgroundColor:'#fff',borderRadius:20,paddingVertical:14,flexDirection:'row',alignItems:'center',justifyContent:'center' },
  // Forms
  label:        { fontSize:11,fontWeight:'700',color:'#9ca3af',textTransform:'uppercase',letterSpacing:1,marginBottom:6 },
  input:        { borderWidth:2,borderColor:'#e5e7eb',borderRadius:14,paddingHorizontal:16,paddingVertical:12,fontSize:14,color:'#374151',backgroundColor:'#fff' },
  tabBar:       { flexDirection:'row',backgroundColor:'rgba(255,255,255,.2)',borderRadius:14,padding:4 },
  tabBtn:       { flex:1,paddingVertical:10,borderRadius:10,alignItems:'center' },
  tabBtnActive: { backgroundColor:'#fff' },
  verifiedBox:  { flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#f0fdf4',borderColor:'#86efac',borderWidth:1,borderRadius:14,paddingHorizontal:16,paddingVertical:12 },
  // Headers
  header:       { paddingTop:Platform.OS==='android'?40:0,paddingHorizontal:20,paddingBottom:20 },
  subHeader:    { paddingTop:Platform.OS==='android'?44:0,paddingHorizontal:20,paddingBottom:16 },
  homeHeader:   { paddingTop:Platform.OS==='android'?40:0,paddingHorizontal:20,paddingBottom:16 },
  searchBox:    { backgroundColor:'#fff',borderRadius:16,paddingHorizontal:14,paddingVertical:11,flexDirection:'row',alignItems:'center' },
  catRow:       { backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#f3f4f6',maxHeight:52 },
  catChip:      { paddingHorizontal:14,paddingVertical:6,borderRadius:99,backgroundColor:'#f3f4f6' },
  catChipActive:{ backgroundColor:G },
  banner:       { marginHorizontal:16,marginTop:12,marginBottom:4,background:'#1a6b3c',borderRadius:20,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:G },
  iconCircle:   { width:36,height:36,backgroundColor:'rgba(255,255,255,.2)',borderRadius:18,alignItems:'center',justifyContent:'center' },
  // Cards
  card:         { backgroundColor:'#fff',borderRadius:20,padding:12,borderWidth:1,borderColor:'#f3f4f6',shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:4,elevation:2 },
  cardImg:      { width:'100%',height:88,backgroundColor:BG,borderRadius:14,alignItems:'center',justifyContent:'center',marginBottom:8 },
  cardTitle:    { fontSize:12,fontWeight:'700',color:'#1f2937',marginBottom:4,lineHeight:16 },
  cardPrice:    { color:G,fontWeight:'900',fontSize:14,marginBottom:4 },
  buyBtn:       { backgroundColor:G,borderRadius:12,paddingVertical:7,alignItems:'center' },
  buyBtnTxt:    { color:'#fff',fontWeight:'700',fontSize:12 },
  // Product
  productImg:   { backgroundColor:'#fff',marginHorizontal:0,borderRadius:24,paddingVertical:28,alignItems:'center',borderWidth:1,borderColor:'#f3f4f6' },
  conditionBadge:{ backgroundColor:'#f0fdf4',borderRadius:99,paddingHorizontal:12,paddingVertical:4,marginTop:8 },
  productCard:  { backgroundColor:'#fff',borderRadius:20,padding:16,borderWidth:1,borderColor:'#f3f4f6' },
  sectionLabel: { fontSize:11,fontWeight:'700',color:'#9ca3af',textTransform:'uppercase',letterSpacing:1,marginBottom:10 },
  avatar:       { width:48,height:48,backgroundColor:G,borderRadius:24,alignItems:'center',justifyContent:'center' },
  safeZone:     { backgroundColor:'#f0fdf4',borderWidth:2,borderColor:'#bbf7d0',borderRadius:20,padding:16,flexDirection:'row',alignItems:'center',gap:12 },
  // Chat
  chatAvatar:   { width:36,height:36,backgroundColor:'#fff',borderRadius:18,alignItems:'center',justifyContent:'center' },
  itemBanner:   { backgroundColor:'#fffbeb',borderBottomWidth:1,borderBottomColor:'#fde68a',paddingHorizontal:16,paddingVertical:8,flexDirection:'row',alignItems:'center' },
  dateBadge:    { backgroundColor:'#f3f4f6',borderRadius:99,paddingHorizontal:12,paddingVertical:3 },
  bubble:       { maxWidth:'75%',paddingHorizontal:14,paddingVertical:10,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.08,shadowRadius:4,elevation:1 },
  bubbleBuyer:  { backgroundColor:G,borderRadius:18,borderBottomRightRadius:4 },
  bubbleSeller: { backgroundColor:'#fff',borderRadius:18,borderBottomLeftRadius:4,borderWidth:1,borderColor:'#f3f4f6' },
  chatInput:    { backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#f3f4f6',paddingHorizontal:16,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:8 },
  offerBtn:     { backgroundColor:BG,borderColor:'#bbf7d0',borderWidth:1,borderRadius:12,paddingHorizontal:10,paddingVertical:8 },
  msgInput:     { flex:1,backgroundColor:'#f9fafb',borderWidth:1,borderColor:'#e5e7eb',borderRadius:14,paddingHorizontal:14,paddingVertical:10,fontSize:13,color:'#374151' },
  sendBtn:      { width:40,height:40,backgroundColor:G,borderRadius:12,alignItems:'center',justifyContent:'center' },
  payQuickBtn:  { backgroundColor:'#fff',borderRadius:99,paddingHorizontal:14,paddingVertical:6 },
  // Payment
  summaryCard:  { backgroundColor:'#fff',borderRadius:20,padding:16,borderWidth:1,borderColor:'#f3f4f6' },
  summaryEmoji: { width:52,height:52,backgroundColor:BG,borderRadius:14,alignItems:'center',justifyContent:'center' },
  summaryFooter:{ marginTop:12,paddingTop:12,borderTopWidth:1,borderTopColor:'#f3f4f6',flexDirection:'row',alignItems:'center',justifyContent:'space-between' },
  methodRow:    { backgroundColor:'#fff',borderWidth:2,borderColor:'#f3f4f6',borderRadius:20,padding:14,flexDirection:'row',alignItems:'center',gap:14 },
  formCard:     { backgroundColor:'#fff',borderRadius:20,padding:20,borderWidth:1,borderColor:'#f3f4f6' },
  cardVisual:   { borderRadius:20,padding:20 },
  transferBox:  { backgroundColor:'#eff6ff',borderWidth:2,borderColor:'#bfdbfe',borderRadius:20,padding:16 },
  acctBox:      { backgroundColor:'#fff',borderRadius:14,padding:14,borderWidth:1,borderColor:'#bfdbfe' },
  successIcon:  { width:96,height:96,backgroundColor:BG,borderWidth:4,borderColor:G,borderRadius:48,alignItems:'center',justifyContent:'center' },
  receiptCard:  { width:'100%',backgroundColor:BG,borderWidth:2,borderColor:'#bbf7d0',borderRadius:20,padding:16,gap:10 },
  receiptRow:   { flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12 },
  qrCard:       { width:'100%',backgroundColor:'#eff6ff',borderWidth:1,borderColor:'#bfdbfe',borderRadius:20,padding:16,alignItems:'center' },
  refundNote:   { width:'100%',backgroundColor:'#fff7ed',borderWidth:1,borderColor:'#fed7aa',borderRadius:14,padding:12 },
  // Sell
  geoChip:      { flexDirection:'row',alignItems:'center',backgroundColor:'#dcfce7',borderColor:'#86efac',borderWidth:1,borderRadius:99,paddingHorizontal:14,paddingVertical:6,alignSelf:'flex-start',gap:6 },
  photoUpload:  { borderWidth:2,borderColor:'#d1d5db',borderStyle:'dashed',borderRadius:20,height:130,alignItems:'center',justifyContent:'center',gap:8,backgroundColor:'#fff' },
  photoUploadDone:{ borderColor:'#22c55e',backgroundColor:'#f0fdf4' },
  priceInputWrap:{ position:'relative',justifyContent:'center' },
  // Profile
  profileAvatar:{ width:80,height:80,backgroundColor:'#fff',borderRadius:40,alignItems:'center',justifyContent:'center',marginBottom:12,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.15,shadowRadius:10,elevation:5 },
  statsRow:     { flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#f3f4f6' },
  statCell:     { flex:1,alignItems:'center',paddingVertical:16 },
  listingCard:  { backgroundColor:'#fff',borderRadius:20,padding:12,borderWidth:1,borderColor:'#f3f4f6',flexDirection:'row',alignItems:'center',gap:12,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:4,elevation:1 },
  listingEmoji: { width:52,height:52,backgroundColor:BG,borderRadius:14,alignItems:'center',justifyContent:'center' },
  activeBadge:  { backgroundColor:'#f0fdf4',borderRadius:99,paddingHorizontal:10,paddingVertical:2,alignSelf:'flex-start' },
  settingsCard: { backgroundColor:'#fff',borderRadius:20,overflow:'hidden',borderWidth:1,borderColor:'#f3f4f6' },
  settingsRow:  { flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6' },
  toggle:       { width:46,height:24,borderRadius:12,backgroundColor:'#d1d5db',justifyContent:'center' },
  toggleThumb:  { width:18,height:18,backgroundColor:'#fff',borderRadius:9,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.2,shadowRadius:2,elevation:2 },
  logoutBtn:    { backgroundColor:'#fef2f2',borderWidth:2,borderColor:'#fecaca',borderRadius:20,paddingVertical:14,alignItems:'center' },
  newListingBtn:{ backgroundColor:BG,borderColor:'#bbf7d0',borderWidth:1,borderRadius:99,paddingHorizontal:14,paddingVertical:5 },
  // Modal
  modalOverlay: { flex:1,backgroundColor:'rgba(0,0,0,.5)',justifyContent:'flex-end' },
  modalSheet:   { backgroundColor:'#fff',borderRadius:24,padding:24,paddingBottom:40 },
  sheetHandle:  { width:48,height:4,backgroundColor:'#e5e7eb',borderRadius:2,alignSelf:'center',marginBottom:20 },
  // Bottom nav
  bottomNav:    { flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#f3f4f6',paddingBottom:Platform.OS==='ios'?20:0 },
  navItem:      { flex:1,alignItems:'center',paddingTop:10,paddingBottom:Platform.OS==='ios'?4:10,gap:2 },
});
