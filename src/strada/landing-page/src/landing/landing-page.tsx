import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Shield,
  Smartphone,
  ArrowRight,
  Play,
  Apple,
  Menu,
  X,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";
import introImage from "../assets/ChatGPT Image May 23, 2025, 01_06_12 PM.png";

const colors = {
  white: "#FFFFFF",
  black: "#1A1A1A",
  primaryPink: "#FF758F",
  lightPink: "#FFD1DC",
  darkPink: "#E63950",
  neutralLight: "#F0F2F5",
  primaryBlue: "#003360",
  primaryBlueDarkTheme: "#1E90FF",
  secondaryBlue: "#4D8CFF",
  accentBlue: "#66A3FF",
  softBlue: "#E6F0FF",
  lightGrey: "#F0F0F0",
  grey: "#BDBDBD",
  darkGrey: "#8C8C8C",
};

const StradaLanding = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Conexão Instantânea",
      description:
        "Encontre caronas em segundos com nosso algoritmo inteligente que conecta pessoas com rotas similares",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Segurança Total",
      description:
        "Verificação completa de usuários, sistema de avaliações e monitoramento 24h para sua tranquilidade",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Comunidade Confiável",
      description:
        "Milhares de usuários verificados compartilhando viagens com economia, conforto e sustentabilidade",
    },
  ];

  const benefits = [
    "Economize até 70% nos custos de viagem",
    "Reduza sua pegada de carbono",
    "Conheça pessoas incríveis",
    "Viaje com total segurança",
    "Interface intuitiva e moderna",
    "Suporte 24/7 disponível",
  ];

  const stats = [
    { number: "50K+", label: "Usuários Ativos" },
    { number: "1M+", label: "Caronas Realizadas" },
    { number: "4.9★", label: "Avaliação App Store" },
    { number: "95%", label: "Satisfação" },
  ];

  const handleScrollToSection = (e, id: string) => {
    setMobileMenuOpen(false);
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 flex justify-between items-center">
          <a
            href="#start"
            className="flex items-center space-x-3"
            onClick={(e) => handleScrollToSection(e, "start")}
          >
            <div className="text-3xl font-bold">
              <span style={{ color: colors.primaryBlue }}>Stra</span>
              <span style={{ color: colors.primaryPink }}>da</span>
            </div>
          </a>

          <nav className="hidden lg:flex space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              onClick={(e) => handleScrollToSection(e, "features")}
            >
              Recursos
            </a>
            <a
              href="#benefits"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              onClick={(e) => handleScrollToSection(e, "benefits")}
            >
              Vantagens
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              onClick={(e) => handleScrollToSection(e, "how-it-works")}
            >
              Como Funciona
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              className="hidden sm:block px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.darkPink})`,
              }}
            >
              Baixar App
            </button>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6">
            <nav className="space-y-4">
              <a href="#features" className="block text-gray-600 font-medium">
                Recursos
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-600 font-medium"
              >
                Como Funciona
              </a>
              <a href="#benefits" className="block text-gray-600 font-medium">
                Vantagens
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="start"
        className="pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 relative overflow-hidden min-h-screen flex items-center"
      >
        <div className="w-full max-w-8xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <div
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: colors.softBlue,
                    color: colors.primaryBlue,
                  }}
                >
                  🚗 Novo jeito de viajar chegou!
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                  <span style={{ color: colors.primaryBlue }}>Compartilhe</span>
                  <br />
                  <span style={{ color: colors.primaryBlue }}>
                    caronas e viaje
                  </span>
                  <br />
                  <span>com </span>
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.darkPink})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    economia
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Conecte-se com pessoas incríveis, economize dinheiro e viaje
                  com conforto e tranquilidade. O futuro da mobilidade urbana
                  está aqui.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-white font-semibold text-base sm:text-lg transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.darkPink})`,
                  }}
                >
                  <span>Vamos começar</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 font-semibold text-base sm:text-lg transition-all hover:scale-105 bg-white hover:bg-gray-50"
                  style={{
                    borderColor: colors.primaryBlue,
                    color: colors.primaryBlue,
                  }}
                >
                  <Play className="w-5 h-5" />
                  <span>Ver Como Funciona</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-6 sm:pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: colors.primaryBlue }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              {/* Phone Mockup */}
              <div className="relative mx-auto max-w-sm">
                {/* Background Elements */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: colors.primaryPink }}
                />
                <div
                  className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-20 animate-bounce"
                  style={{ backgroundColor: colors.accentBlue }}
                />

                {/* Phone Frame */}
                <div className="h-[770px] relative bg-black rounded-[3rem] p-2 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="h-[750px] bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

                    {/* Screen Content */}
                    <div className="pt-8 pb-8 px-6 h-[600px] flex flex-col">
                      {/* Logo */}
                      <div className="text-center mb-8">
                        <div className="text-2xl font-bold mb-2">
                          <span style={{ color: colors.primaryBlue }}>
                            Stra
                          </span>
                          <span style={{ color: colors.primaryPink }}>da</span>
                        </div>
                      </div>

                      {/* Illustration Area */}
                      <div className="flex-1 flex items-center pt-20 justify-center mb-8">
                        <div className="relative">
                          <img
                            src={introImage}
                            alt="Phone Illustration"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="text-center mb-8 pb-20">
                        <p className="text-gray-600 leading-relaxed">
                          Compartilhe caronas e viaje com economia, conforto e
                          tranquilidade.
                        </p>
                      </div>

                      {/* CTA Button */}
                      <button
                        className="w-full py-4 text-white font-semibold text-lg rounded-2xl"
                        style={{
                          background: `${colors.primaryBlue}`,
                        }}
                      >
                        Vamos começar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12"
        style={{ backgroundColor: colors.neutralLight }}
      >
        <div className="w-full max-w-8xl mx-auto h-[100vh] justify-center flex flex-col">
          <div className="text-center mb-12 -mt-56 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
              style={{ color: colors.primaryBlue }}
            >
              Por que escolher o Strada?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta, segurança máxima e a melhor experiência de
              carona compartilhada
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index
                    ? "shadow-2xl transform scale-105"
                    : "shadow-lg"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                  style={{
                    backgroundColor:
                      activeFeature === index
                        ? colors.primaryPink
                        : colors.lightPink,
                    color:
                      activeFeature === index ? colors.white : colors.darkPink,
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold mb-4"
                  style={{ color: colors.primaryBlue }}
                >
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div
                  className="flex items-center space-x-2 font-semibold text-sm sm:text-base"
                  style={{ color: colors.primaryPink }}
                >
                  <span>Saiba mais</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        <div className="w-full max-w-8xl mx-auto h-[100vh] items-center flex">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center mb-44">
            <div className="space-y-6 sm:space-y-8">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{ color: colors.primaryBlue }}
              >
                Vantagens que fazem a diferença
              </h2>

              <p className="text-base sm:text-xl text-gray-600 leading-relaxed">
                Descubra como o Strada transforma sua forma de viajar,
                conectando pessoas e criando experiências únicas.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle
                      className="w-6 h-6 mt-0.5 flex-shrink-0"
                      style={{ color: colors.primaryPink }}
                    />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.accentBlue})`,
                }}
              />

              <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.lightPink }}
                      >
                        <MapPin
                          className="w-6 h-6"
                          style={{ color: colors.darkPink }}
                        />
                      </div>
                      <div>
                        <div
                          className="font-semibold"
                          style={{ color: colors.primaryBlue }}
                        >
                          Betim - Centro → Educare
                        </div>
                        <div className="text-sm text-gray-500">Hoje, 18:30</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: colors.primaryPink }}
                      >
                        R$ 25
                      </div>
                      <div className="text-sm text-gray-500">por pessoa</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: colors.accentBlue }}
                          >
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        3 vagas disponíveis
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Star
                      className="w-4 h-4 fill-current"
                      style={{ color: colors.primaryPink }}
                    />
                    <span style={{ color: colors.primaryBlue }}>4.9</span>
                    <span className="text-gray-500">• Maria S.</span>
                  </div>

                  <button
                    className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.darkPink})`,
                    }}
                  >
                    Reservar Vaga
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12"
        style={{ backgroundColor: colors.neutralLight }}
      >
        <div className="w-full max-w-8xl mx-auto py-36">
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
              style={{ color: colors.primaryBlue }}
            >
              Como funciona
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Três passos simples para começar a economizar e conhecer pessoas
              incríveis
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Cadastre-se",
                desc: "Crie seu perfil seguro em menos de 2 minutos com verificação completa",
              },
              {
                step: "02",
                title: "Conecte-se",
                desc: "Encontre caronas ideais ou ofereça a sua com nosso algoritmo inteligente",
              },
              {
                step: "03",
                title: "Viaje",
                desc: "Aproveite a jornada com economia, conforto e novas amizades",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white transition-all group-hover:scale-110 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryPink}, ${colors.darkPink})`,
                  }}
                >
                  {item.step}
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold mb-4"
                  style={{ color: colors.primaryBlue }}
                >
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 text-center text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryBlue}, ${colors.primaryBlue})`,
        }}
      >
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Pronto para sua primeira viagem?
          </h2>

          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
            Junte-se a milhares de pessoas que já economizam e viajam de forma
            inteligente com o Strada
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-2xl font-semibold text-base sm:text-lg transition-all hover:scale-105 shadow-xl"
              style={{ color: colors.primaryBlue }}
            >
              <Smartphone className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>Google Play</span>
            </button>
            <button
              className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-2xl font-semibold text-base sm:text-lg transition-all hover:scale-105 shadow-xl"
              style={{ color: colors.primaryBlue }}
            >
              <Apple className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>App Store</span>
            </button>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-10 left-10 w-32 h-32 rounded-full animate-pulse"
            style={{ backgroundColor: colors.primaryPink }}
          />
          <div
            className="absolute bottom-10 right-10 w-24 h-24 rounded-full animate-bounce"
            style={{ backgroundColor: colors.accentBlue }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-pulse"
            style={{ backgroundColor: colors.lightPink }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-900 text-white">
        <div className="w-full max-w-8xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span style={{ color: colors.white }}>Stra</span>
                <span style={{ color: colors.primaryPink }}>da</span>
              </div>
              <p className="text-gray-400 text-sm">
                Conectando pessoas, economizando recursos, construindo o futuro
                da mobilidade.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Como Funciona
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Recursos
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Preços
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Central de Ajuda
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Contato
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Blog
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Privacidade
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Termos de Uso
                </a>
                <a
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 Strada. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StradaLanding;
