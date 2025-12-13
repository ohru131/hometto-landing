import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, Heart, Link as LinkIcon, Shield, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"}`}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">H</div>
            <span className="font-heading font-bold text-2xl text-foreground">Hometto</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-heading font-semibold text-muted-foreground">
            <a href="#problem" className="hover:text-primary transition-colors">課題</a>
            <a href="#solution" className="hover:text-primary transition-colors">解決策</a>
            <a href="#features" className="hover:text-primary transition-colors">特徴</a>
            <a href="#future" className="hover:text-primary transition-colors">未来</a>
          </nav>
          <Link href="/demo">
            <Button className="btn-bouncy bg-primary text-white hover:bg-primary/90 rounded-full px-6">
              デモを見る
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 right-[-5%] w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-[-5%] w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          
          <div className="container grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6 animate-in slide-in-from-left duration-700 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border/50">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="text-sm font-bold text-muted-foreground">HACK+2026 Pitch</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-tight text-foreground">
                子ども同士が、<br />
                <span className="text-primary">成長</span>と<span className="text-secondary">協力</span>を<br />
                記録する。
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Hometto（ほめっと）は、ブロックチェーン技術を活用したWeb3学級アプリ。
                先生だけでなく、子ども同士が認め合う新しい学校の形をつくります。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/role-selection">
                  <Button size="lg" className="btn-bouncy bg-primary text-white hover:bg-primary/90 text-lg px-8 h-14">
                    はじめる
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="btn-bouncy border-2 border-foreground/10 hover:bg-foreground/5 text-lg px-8 h-14">
                  仕組みを知る
                </Button>
              </div>
            </div>
            <div className="relative animate-in slide-in-from-right duration-700 fade-in delay-200">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/images/slide_01_title_generated.webp" 
                  alt="Hometto Hero" 
                  className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white rotate-2"
                />
              </div>
              {/* Decorative floating elements */}
              <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl rotate-12 animate-bounce duration-[3000ms]">
                <Heart className="w-8 h-8 text-secondary fill-secondary" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl -rotate-6 animate-bounce duration-[4000ms] delay-500">
                <Star className="w-8 h-8 text-accent fill-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-20 bg-white relative">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">学校現場の<span className="text-secondary">見えない課題</span></h2>
              <p className="text-lg text-muted-foreground">
                テストの点数は記録に残るけれど、毎日の「優しさ」や「協力」は消えてしまう。
                そんな違和感から、私たちはスタートしました。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <img 
                  src="/images/slide_02_problem_generated.webp" 
                  alt="Invisible Issues" 
                  className="w-full rounded-3xl shadow-xl border-4 border-muted/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl pointer-events-none" />
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">良い行動が見えにくい</h3>
                    <p className="text-muted-foreground">先生一人では、30人以上の生徒の細かな良い行動を全て把握することは不可能です。</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">評価の偏りと承認不足</h3>
                    <p className="text-muted-foreground">目立つ子ばかりが評価され、静かに頑張る子が埋もれてしまう。承認不足は自己肯定感の低下に繋がります。</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">記録に残らない成長</h3>
                    <p className="text-muted-foreground">「手伝ってくれた」「協力できた」という大切な瞬間が、どこにも記録されずに流れていってしまいます。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-20 bg-background overflow-hidden">
          <div className="container">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">Solution</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mt-2 mb-6">ほめっとの<span className="text-primary">2つの仕組み</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Good Act Chain */}
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/slide_05_good_act_generated.webp" 
                    alt="Good Act Chain" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">Good Act Chain</div>
                      <h3 className="text-2xl font-heading font-bold">ほめチェーン</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    友達の良い行動を見つけたら、タブレットから「ほめトークン」を送ります。
                    ネガティブな評価は一切なし。先生は見守るだけで、子どもたちが主役です。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Check className="w-5 h-5 text-secondary" />
                      一言コメントで気軽に送信
                    </li>
                    <li className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Check className="w-5 h-5 text-secondary" />
                      匿名・ニックネーム対応
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Cooperation Chain */}
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="/images/slide_06_cooperation_generated.webp" 
                    alt="Cooperation Chain" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">Cooperation Chain</div>
                      <h3 className="text-2xl font-heading font-bold">協力チェーン</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    グループ活動や掃除など、協力できたらメンバー全員で「協力NFT」を共同発行。
                    Symbolブロックチェーンのアグリゲートトランザクションで「一緒にやった」を証明。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Check className="w-5 h-5 text-primary" />
                      連名で証明書を発行
                    </li>
                    <li className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Check className="w-5 h-5 text-primary" />
                      チームワークが資産になる
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="bg-foreground rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">なぜ <span className="text-accent">Symbol</span> なのか？</h2>
                  <p className="text-white/80 text-lg mb-8 leading-relaxed">
                    教育現場に必要なのは、誰にも改ざんされない「信頼」の記録です。
                    Symbolブロックチェーンは、軽量で手数料が安く、教育現場での運用に最適です。
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      <Shield className="w-8 h-8 text-accent" />
                      <div>
                        <h4 className="font-bold text-lg">改ざん不可能</h4>
                        <p className="text-sm text-white/70">記録は永遠に残り、恣意的な書き換えを防ぎます。</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      <Users className="w-8 h-8 text-accent" />
                      <div>
                        <h4 className="font-bold text-lg">透明性</h4>
                        <p className="text-sm text-white/70">「誰が・いつ・誰を」評価したかが明確に残ります。</p>
                      </div>
                    </div>
                    <Link href="/blockchain-info">
                      <Button size="lg" variant="outline" className="mt-6 bg-white/10 hover:bg-white/20 text-white border-white/30">
                        ブロックチェーン記録を見る
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="/images/slide_07_blockchain_generated.webp" 
                    alt="Symbol Blockchain" 
                    className="w-full rounded-3xl shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section id="future" className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">未来への<span className="text-primary">広がり</span></h2>
              <p className="text-lg text-muted-foreground">
                学級から始まった信頼の輪は、学校全体、そして社会へと広がっていきます。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">不登校支援</h3>
                <p className="text-muted-foreground text-sm">オンラインでの参加や活動も記録として残り、学校との繋がりを維持します。</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">探究学習ポートフォリオ</h3>
                <p className="text-muted-foreground text-sm">プロジェクト学習の成果やプロセスをNFTとして蓄積し、独自のポートフォリオに。</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">成長証明の持ち運び</h3>
                <p className="text-muted-foreground text-sm">進学や転校の際も、積み重ねた信頼と実績のデータを新しい環境へ持ち運べます。</p>
              </div>
            </div>

            <div className="mt-16 relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/images/slide_10_future_generated.webp" 
                alt="Future Vision" 
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-3xl md:text-5xl font-heading font-bold text-white text-center px-4">
                  Re:Free<br/>
                  <span className="text-xl md:text-2xl font-normal mt-2 block">自由な信頼を取り戻そう</span>
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-foreground">
                  子どもを信じるための<br/>技術をはじめよう。
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Homettoは、管理のためではなく、信頼のためのツールです。<br/>
                  あなたの学校でも、新しい評価の形を体験しませんか？
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/demo">
                  <Button size="lg" className="btn-bouncy bg-primary text-white hover:bg-primary/90 text-xl px-10 h-16 rounded-full shadow-xl shadow-primary/30">
                    デモを体験する
                  </Button>
                </Link>
                  <Button size="lg" variant="outline" className="btn-bouncy bg-white border-2 border-foreground/10 text-xl px-10 h-16 rounded-full">
                    資料ダウンロード
                  </Button>
                </div>
              </div>
              
              {/* Decorative Background Blobs */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-foreground font-heading font-bold text-lg">H</div>
                <span className="font-heading font-bold text-xl">Hometto</span>
              </div>
              <p className="text-white/60 max-w-sm">
                子ども同士が、成長と協力を記録するWeb3学級アプリ。<br/>
                Symbolブロックチェーン技術活用。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">機能一覧</a></li>
                <li><a href="#" className="hover:text-white transition-colors">導入事例</a></li>
                <li><a href="#" className="hover:text-white transition-colors">料金プラン</a></li>
                <li><a href="#" className="hover:text-white transition-colors">セキュリティ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">私たちについて</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ニュース</a></li>
                <li><a href="#" className="hover:text-white transition-colors">採用情報</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2026 Hometto Project. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-white transition-colors">利用規約</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
