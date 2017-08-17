<template>
  <div class="main-content">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8 is-narrow">
          <h1 class="has-text-centered"><img class="login-logo" src="../assets/swop-logo-invert.svg"></h1>
          <h2 class="subtitle has-text-centered has-text-white">Swop ist Dein Tool zum Finden eines Tauschpartners für Deine Uni-Veranstaltungen.</h2>
          <div class="spacer"></div>
        </div>
      </div>

      <!-- Inhalt / Formulare -->
      <div class="columns is-centered">
        <!-- Logo + Text -->
        <div class="column is-8 is-narrow is-form">

          <div class=" task-description-title">
            <h4 class="title has-text-centered">Registrieren</h4>
          </div>

          <div class="task-description">
            <p class="description has-text-centered">Melde Dich mit Deiner Uni-Mail an und erstelle Deinen kostenlosen swop-Account.</p>
          </div>

          <div class="spacer"></div>

          <!-- Formulare -->
          <form class="signUp">
            <b-field>
              <p class="control has-icons-left ">
                <input v-model.trim="name" class="input" type="text" placeholder="Deine Name" name="name" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                </span>
              </p>
            </b-field>
            <div class="spacer"></div>

            <b-field>
              <p class="control has-icons-left ">
                <input v-model.trim="username" class="input" :class="{'is-danger': mailError}" type="mail" placeholder="Deine Uni-Mail" name="username" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
              </p>
            </b-field>
            <div class="spacer"></div>

            <b-field>
              <p class="control has-icons-left">
                <input v-model="password" class="input" type="password" placeholder="Dein swop-Passwort" name="password" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
            </b-field>

            <b-field>
            <div v-on:keyup="confirmPasswordValidator">
              <p class="control has-icons-left">
                <input v-model="bPassword" class="input" v-bind:class="{ dangerInput : isDanger }" type="password" placeholder="Bestätige Dein swop-Passwort" name="bPassword" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
            </div>
            </b-field>
          <p v-if="mailError" class="help is-danger">Es gibt ein Problem mit Deiner Mail-Adresse. <br> Kontrolliere, ob es sich um eine Uni-Mail handeln oder Du bereits einen Account hast.</p>
          <p v-if="passwordError" class="help is-danger">Deine Passwörter müssen übereinstimmen damit Du Dich registrieren kann.</p>
          <div class="spacer"></div>
          <div class="field">
            <b-checkbox v-model="checkBoxChecked">Ich habe die <a @click="toggleModal()">Allgemeinen Gurkenbedingungen</a> gelesen und akzeptiere diese</b-checkbox>
          </div>
          </form>
          <!-- Registierungsbutton -->
          <p class="has-text-right flex-center"><router-link :to="{name: 'login'}" class="is-white font-klein margin-right">Bereits Mitglied? </router-link><a class="button is-primary" @click="registerPossible">Registrieren</a></p>
        </div>
      </div>
  </div>

  <div class="modal" :class="{'is-active': modalOpen}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <article class="message is-medium">
  <div class="message-header">
    <p>
Verordnung (EWG) Nr. 1677/88 der Kommission vom 15. Juni 1988 zur Festsetzung von Qualitätsnormen für Gurken</p>
  </div>
  <div class="message-body content">
    <br>Amtsblatt Nr. L 150 vom 16/06/1988 S. 0021 - 0025<br> Finnische Sonderausgabe: Kapitel 3 Band 26 S. 0207 <br> Schwedische Sonderausgabe: Kapitel 3 Band 26 S. 0207 <br> </em>
    </p>
    <br>
    <p>
    <p>*****  </p><p>VERORDNUNG  (EWG) Nr. 1677/88 DER KOMMISSION  </p><p>vom 15. Juni 1988  </p><p>zur Festsetzung von Qualitätsnormen für Gurken  </p><p>DIE KOMMISSION DER EUROPÄISCHEN  </p><p>GEMEINSCHAFTEN -  </p><p>gestützt auf den Vertrag zur Gründung der Europäischen Wirtschaftsgemeinschaft,  </p><p>gestützt auf die Verordnung (EWG) Nr. 1035/72 des Rates vom 18. Mai 1972 über die gemeinsame Marktorganisation für Obst und Gemüse (1), zuletzt geändert durch die Verordnung (EWG) Nr. 1117/88 (2), insbesondere auf Artikel 2 Absatz 3,  </p><p>in Erwägung nachstehender Gründe:  </p><p>Mit der Verordnung Nr. 183/64/EWG des Rates (3) wurden Qualitätsnormen für Gurken festgelegt.  </p><p>Bei der Erzeugung von und beim Handel mit diesen Produkten hat sich namentlich hinsichtlich der Anforderungen der Verbraucher- und Großhandelsmärkte eine Entwicklung vollzogen. Die gemeinsamen Qualitätsnormen für Gurken sollten daher geändert werden, um diesen neuen Anforderungen Rechnung zu tragen.  </p><p>Diese Änderungen schließen eine Änderung der zusätzlichen Güteklasse gemäß der Verordnung (EWG) Nr. 1194/69 des Rates (4), zuletzt geändert durch die Verordnung (EWG) Nr. 79/88 (5), ein. Bei der Definition dieser Güteklasse ist sowohl dem wirtschaftlichen Interesse, das die Erzeugnisse für die Erzeuger haben, als auch der Notwendigkeit Rechnung zu tragen, die Bedürfnisse der Verbraucher zu befriedigen.  </p><p>Die Normen gelten für alle Vermarktungsstufen. Die Beförderung über eine grosse Entfernung, die Lagerung während einer gewissen Dauer und die verschiedenen Behandlungen, denen die Erzeugnisse unterzogen werden, können aufgrund der biologischen Entwicklung dieser Erzeugnisse oder ihres mehr oder weniger leicht verderblichen Charakters gewisse Beeinträchtigungen nach sich ziehen. Diese Beeinträchtigungen sind somit bei der Anwendung der Normen auf der auf die Versandstufe folgenden Vermarktungsstufe zu berücksichtigen.  </p><p>Aus Gründen der Übersichtlichkeit und der Rechtssicherheit sowie im Interesse der Beteiligten empfiehlt es sich, die so geänderten Normen in einem einzigen Text zusammenzufassen.  </p><p>Die in dieser Verordnung vorgesehenen Maßnahmen entsprechen der Stellungnahme des Verwaltungsausschusses für Obst und Gemüse -  </p><p>HAT FOLGENDE VERORDNUNG ERLASSEN:  </p><p>Artikel 1  </p><p>Die Qualitätsnormen für Gurken der Unterpositionen 0707 00 11 und 0707 00 19 der Kombinierten Nomenklatur stehen im Anhang dieser Verordnung.  </p><p>Diese Normen gelten für alle Vermarktungsstufen unter den in der Verordnung (EWG) Nr. 1035/72 vorgesehenen Bedingungen.  </p><p>Auf den der Versandstufe folgenden Vermarktungsstufen dürfen die Erzeugnisse jedoch von den Normenvorschriften hinsichtlich Frische- und Prallheitsgrad, die geringfügig nachgelassen haben, und hinsichtlich geringfügiger Veränderungen infolge biologischer Entwicklungsvorgänge und ihrer Verderblichkeit abweichen.  </p><p>Artikel 2  </p><p>Die Verordnung Nr. 183/64/EWG wird wie folgt geändert:  </p><p>- in Artikel 1 Absatz 2 wird der zweite Gedankenstrich gestrichen,  </p><p>- der Anhang I Teil 2 wird gestrichen.  </p><p>Artikel 3  </p><p>Die Verordnung (EWG) Nr. 1194/69 wird wie folgt geändert:  </p><p>- in Artikel 1 werden die Worte »und Gurken&quot; gestrichen,  </p><p>- der Anhang VII wird gestrichen.  </p><p>Artikel 4  </p><p>Diese Verordnung tritt am 1. Januar 1989 in Kraft.  </p><p>Diese Verordnung ist in allen ihren Teilen verbindlich und gilt unmittelbar in jedem Mitgliedstaat.  </p><p>Brüssel, den 15. Juni 1988  </p><p>Für die Kommission  </p><p>Frans ANDRIESSEN  </p><p>Vizepräsident  </p><p>(1) ABl. Nr. L 118 vom 20. 5. 1972, S. 1.  </p><p>(2) ABl. Nr. L 107 vom 28. 4. 1988, S. 1.  </p><p>(3) ABl. Nr. 192 vom 25. 11. 1964, S. 3217/64.  </p><p>(4) ABl. Nr. L 157 vom 28. 6. 1969, S. 1.  </p><p>(5) ABl. Nr. L 10 vom 14. 1. 1988, S. 8.  </p><p>ANHANG  </p><p>QUALITÄTSNORM FÜR GURKEN  </p><p>I. BEGRIFFSBESTIMMUNG  </p><p>Diese Norm gilt für Gurken der aus »Cucumis sativus L.&quot; hervorgegangenen Anbausorten zur Lieferung in frischem Zustand an den Verbraucher. Gurken für die industrielle Verarbeitung und Einlegegurken (Cornichons) fallen nicht darunter.  </p><p>II. BESTIMMUNGEN BETREFFEND DIE GÜTEEIGENSCHAFTEN  </p><p>Die Norm bestimmt die Güteeigenschaften, die die Gurken nach Aufbereitung und Verpackung aufweisen müssen.  </p><p>A. Mindesteigenschaften  </p><p>In allen Klassen müssen die Gurken vorbehaltlich besonderer Bestimmungen für jede Klasse und der zulässigen Toleranzen sein:  </p><p>- ganz,  </p><p>- gesund; ausgeschlossen sind Erzeugnisse mit Fäulnisbefall oder anderen Mängeln, die sie zum Verzehr ungeeignet machen,  </p><p>- von frischem Aussehen,  </p><p>- fest,  </p><p>- sauber, praktisch frei von sichtbaren Fremdstoffen,  </p><p>- praktisch frei von Schädlingen,  </p><p>- praktisch frei von Schäden durch Schädlinge,  </p><p>- nicht bitter (vorbehaltlich der für die Klassen II und III im Abschnitt »Toleranzen&quot; zugelassenen Sonderbestimmungen),  </p><p>- frei von anomaler äusserer Feuchtigkeit,  </p><p>- frei von fremdem Geruch und/oder Geschmack,  </p><p>Die Gurken müssen genügend entwickelt, die Kerne jedoch noch weich sein.  </p><p>Der Zustand der Gurken muß so sein, daß sie  </p><p>- Transport und Hantierung aushalten und  </p><p>- in zufriedenstellendem Zustand am Bestimmungsort ankommen.  </p><p>B. Klasseneinteilung  </p><p>Gurken werden in vier nachstehend definierten Klassen eingeteilt:  </p><p>i) Klasse Extra  </p><p>Gurken diese Klasse müssen von höchster Qualität sein und müssen alle sortentypischen Merkmale aufweisen.  </p><p>Sie müssen:  </p><p>- gut entwickelt sein,  </p><p>- gut geformt und praktisch gerade sein (maximale Krümmung: 10 mm auf 10 cm Länge der Gurke),  </p><p>- eine für die Sorte typische Färbung haben,  </p><p>- frei von Fehlern sein, einschließlich aller Formfehler, insbesondere solcher, die auf die Samenentwicklung zurückzuführen sind.  </p><p>ii) Klasse I  </p><p>Gurken dieser Klasse müssen von guter Qualität sein. Sie müssen:  </p><p>- genügend entwickelt sein,  </p><p>- ziemlich gut geformt und praktisch gerade sein (maximale Krümmung: 10 mm auf 10 cm Länge der Gurke).  </p><p>Sie dürfen folgende Fehler aufweisen:  </p><p>- einen leichten Formfehler, der jedoch nicht auf die Samenentwicklung zurückzuführen sein darf,  </p><p>- eine geringe Abweichung in der Färbung, insbesondere eine hellere Färbung des Teils der Gurke, der während des Wachstums mit dem Boden in Berührung war,  </p><p>- leichte Schalenfehler, die auf Reibung, Hantierung oder niedrige Temperaturen zurückzuführen sind, sofern sie vernarbt sind und die Haltbarkeit des Erzeugnisses nicht beeinträchtigen. iii) Klasse II  </p><p>Zu dieser Klasse gehören Gurken, die nicht in die höheren Klassen eingestuft werden können, die aber den vorstehend definierten Mindesteigenschaften entsprechen. Sie dürfen jedoch folgende Fehler aufweisen:  </p><p>- Formfehler, die nicht auf eine fortgeschrittene Samenentwicklung zurückzuführen sind,  </p><p>- Farbfehler auf nicht mehr als einem Drittel der Oberfläche; bei Gurken aus geschütztem Anbau sind starke Farbfehler jedoch nicht zulässig,  </p><p>- vernarbte Risse,  </p><p>- leichte Schäden, die durch Reibung oder Hantierung entstanden sind, sofern sie die Haltbarkeit und das Aussehen der Erzeugnisse nicht wesentlich beeinträchtigen.  </p><p>Gerade und leicht gebogene Gurken dürfen alle vorgenannten Fehler aufweisen.  </p><p>Krumme Gurken hingegen sind nur zulässig, wenn sie ausser leichten Farbfehlern keine anderen Fehler sowie keine andere Verformung als ihre Krümmung aufweisen.  </p><p>Leicht gebogene Gurken können eine maximale Krümmung von 20 mm auf 10 cm Länge der Gurke aufweisen.  </p><p>Krumme Gurken können eine grössere Krümmung aufweisen, sie müssen getrennt aufgemacht werden.  </p><p>iv) Klasse III (1)  </p><p>Zu dieser Klasse gehören Gurken, die nicht in die höheren Klassen eingestuft werden können, die aber den Eigenschaften der Klasse II entsprechen.  </p><p>Krumme Gurken, die wie in der Klasse II getrennt aufzumachen sind, dürfen jedoch alle Mängel aufweisen, die in der Klasse II für gerade und leicht gebogene Gurken zugelassen sind.  </p><p>III. BESTIMMUNGEN BETREFFEND DIE GRÖSSENSORTIERUNG  </p><p>Die Grössensortierung erfolgt nach dem Stückgewicht;  </p><p>i) Das Mindestgewicht für Gurken aus dem Freilandanbau beträgt 180 g;  </p><p>das Mindestgewicht für Gurken aus geschütztem Anbau beträgt 250 g.  </p><p>ii) Unter einem Schutzdach angebaute Gurken der Güteklasse Extra und I müssen u.a.  </p><p>- mindestens 30 cm lang sein, wenn sie 500 g und mehr wiegen,  </p><p>- mindestens 25 cm lang sein, wenn sie 250 bis 500 g wiegen.  </p><p>iii) Die Grössensortierung ist obligatorisch für Gurken der Klassen Extra und I. Der Gewichtsunterschied zwischen der schwersten und der leichtesten Gurke in einem Packstück darf nicht grösser sein als:  </p><p>- 100 g, wenn die leichteste Gurke 180 bis 400 g wiegt,  </p><p>- 150 g, wenn die leichteste Gurke mindestens 400 g wiegt.  </p><p>iv) Die vorstehenden Bestimmungen gelten nicht für »Kurze Gurken&quot;.  </p><p>IV. BESTIMMUNGEN BETREFFEND DIE TOLERANZEN  </p><p>Güte- und Grössentoleranzen sind in jedem Packstück für Erzeugnisse zulässig, die nicht den Anforderungen der angegebenen Klasse genügen.  </p><p>A. Gütetoleranzen  </p><p>i) Klasse Extra  </p><p>5 % nach Anzahl Gurken, die nicht den Eigenschaften der Klasse entsprechen, die aber denen der Klasse I - in Ausnahmefällen einschließlich der Toleranzen der Klasse I - genügen.  </p><p>ii) Klasse I  </p><p>10 % nach Anzahl Gurken, die nicht den Eigenschaften der Klasse entsprechen, die aber denen der Klasse II - in Ausnahmefällen einschließlich der Toleranzen der Klasse II - genügen.  </p><p>iii) Klasse II  </p><p>10 % nach Anzahl Gurken, die weder den Eigenschaften der Klasse noch den Mindesteigenschaften entsprechen; ausgenommen sind jedoch Erzeugnisse mit Fäulnisbefall oder anderen Mängeln, die sie zum Verzehr ungeeignet machen. Im Rahmen dieser Toleranz dürfen höchstens 2 % nach Anzahl Gurken an den Enden einen bitteren Geschmack aufweisen.  </p><p>iv) Klasse III  </p><p>15 % nach Anzahl Gurken, die weder den Eigenschaften der Klasse noch den Mindesteigenschaften entsprechen; ausgenommen sind Erzeugnisse mit Fäulnisbefall oder anderen Mängeln, die sie zum Verzehr ungeeignet machen. Im Rahmen dieser Toleranz dürfen höchstens 4 % nach Anzahl Gurken an den Enden einen bitteren Geschmack aufweisen.  </p><p>B. Grössentoleranzen  </p><p>Für alle Klassen: 10 % nach Anzahl Gurken, die nicht der angegebenen Grössensortierung entsprechen. Diese Toleranz gilt jedoch nur für Gurken, deren Grösse um nicht mehr als 10 % von den festgesetzten Grenzwerten abweicht.  </p><p>V. BESTIMMUNGEN BETREFFEND DIE AUFMACHUNG  </p><p>A. Gleichmässigkeit  </p><p>Der Inhalt jedes Packstücks muß gleichmässig sein und darf nur Gurken gleichen Ursprungs, gleicher Sorte oder gleichen Handelstyps, gleicher Güte und gleicher Grösse (falls nach Grössen sortiert ist) umfassen.  </p><p>Bei Gurken der Klasse III kann sich die Gleichmässigkeit auf den Ursprung und die Sorte oder den Handelstyp beschränken.  </p><p>Der sichtbare Teil des Inhalts des Packstücks muß für den Gesamtinhalt repräsentativ sein.  </p><p>B. Verpackung  </p><p>Die Gurken müssen so verpackt sein, daß sie angemessen geschützt sind.  </p><p>Bei der Verpackung müssen die Gurken so eng geschichtet werden, daß keine Transportschäden entstehen können.  </p><p>Das im Innern des Packstücks verwendete Material muß neu, sauber und so beschaffen sein, daß es bei den Erzeugnissen keine äusseren und inneren Veränderungen hervorrufen kann. Die Verwendung von Material, insbesondere von Papier oder Aufklebern mit Geschäftsangaben, ist zulässig, sofern zur Beschriftung oder Etikettierung ungiftige Farbe bzw. ungiftiger Klebstoff verwendet werden.  </p><p>Die Packstücke müssen frei von jeglichen Fremdstoffen sein.  </p><p>VI. BESTIMMUNGEN BETREFFEND DIE KENNZEICHNUNG  </p><p>Jedes Packstück muß zusammenhängend auf einer Seite folgende Angaben in lesbaren, unverwischbaren und von aussen sichtbaren Buchstaben aufweisen:  </p><p>A. Identifizierung  </p><p>1.2 // Packer und/oder Absender   // Name und Anschrift oder von einer amtlichen Stelle erteiltes oder anerkanntes Geschäftssymbol  </p><p>B. Art des Erzeugnisses  </p><p>- »Gurken&quot;, wenn der Inhalt von aussen nicht sichtbar ist,  </p><p>- »aus geschütztem Anbau&quot; oder gegebenenfalls jeder andere gleichwertige Ausdruck,  </p><p>- »Kurze Gurken&quot; bzw. »Minigurken&quot;.  </p><p>C. Ursprung des Erzeugnisses  </p><p>Ursprungsland bzw. Anbaugebiet oder nationale, regionale oder örtliche Bezeichnung.  </p><p>D. Handelsmerkmale  </p><p>- Klasse, gegebenenfalls »Krumme Gurken&quot; in den Klassen II und III,  </p><p>- Grösse, ausgedrückt durch das Mindest- und Hoechstgewicht (falls nach Grössen sortiert ist),  </p><p>- Stückzahl (wahlfrei).  </p><p>E. Amtlicher Kontrollstempel (wahlfrei)  </p><p>(1) Zusätzliche Klasse im Sinne des Artikels 2 Absatz 1 der Verordnung (EWG) Nr. 1035/72. Die Anwendung dieser Güteklasse oder einiger ihrer Kriterien unterliegt einem Beschluß nach Artikel 4 Absatz 1 der genannten Verordnung.  </p>

    </p>

      <p class="has-text-right flex-center"><a class="is-white font-klein margin-right" @click="toggleModal()">Abbrechen </a><a class="button is-primary" @click="toggleModal(); checkBoxChecked = true">Akzeptieren</a></p>
  </div>
</article>

  </div>
</div>

</div>
</template>

<script type="text/babel">
import db from 'baqend'
import router from '../router'

export default {
  name: 'signup',
  data () {
    return {
      name: null,
      username: null,
      password: null,
      bPassword: null,
      isDanger: false,
      mailError: false,
      passwordError: false,
      modalOpen: false,
      checkBoxChecked: false
    }
  },

  methods: {
    register () {
      db.User.register(this.username, this.password).then(_ => {
        router.push('me')
      }).catch((err) => {
        console.log(err)
        this.mailError = true
      })
    },
    registerPossible () {
      if (this.isDanger) {
        this.passwordError = true
      } else {
        this.register()
      }
    },

    confirmPasswordValidator () {
      if (this.password !== this.bPassword) {
        this.isDanger = true
        return false
      } else {
        this.isDanger = false
        return true
      }
    },
    toggleModal () {
      this.modalOpen = !this.modalOpen
      this.checkBoxChecked = false
    }
  },

  computed: {
    isValid () {
      return this.username && this.password
    }
  },
  beforeRouteEnter (to, from, next) {
    if (db.User.me) {
      next('dashboard')
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  padding: 0 1rem !important;
  display: flex;
  align-items: center;
  height: 100vh;
  background-color: #F39016;
}
.main-content .container {
  margin-top: -10vh;
}
.login-logo {
  width: 70%;
}
@media only screen and (min-width: 400px) {
  .login-logo {
    width: 50%;
  }
}
.is-form {
  border-color: #ffffff;
  box-shadow: 0px 40px 20px -20px rgba(#000000, 0.05);
}

.dangerInput {
  border-color: #ff0000 !important;
}
</style>
