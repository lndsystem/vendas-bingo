import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TituloService } from '../../service/titulo.service';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { QRCodeComponent } from 'angularx-qrcode';
import { Subscription } from 'rxjs';
import { PagamentoSseService } from '../../service/pagamento-sse.service';

@Component({
  selector: 'app-pay-ticket',
  imports: [
    CommonModule, 
    FormsModule, 
    PanelModule, 
    DialogModule, 
    SelectModule,
    InputTextModule, 
    InputMaskModule, 
    ButtonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    QRCodeComponent
  ],
  templateUrl: './pay-ticket.component.html',
  styleUrl: './pay-ticket.component.css'
})
export class PayTicketComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('botaoComprar') botaoComprar?: ElementRef<HTMLElement>;

  botaoVisivel = false;
  private observer?: IntersectionObserver;
  private elementoObservado?: HTMLElement;

  visible = true;
  estados: any[] = [];
  municipios: any[] = [];

  loading = false;
  precisaCadastrar = false;

  myForm!: FormGroup;

  documento = '';

  podeComprar = false;

  nomeComprador = '';

  tituloComprar: any = [];

  cpfComprador = '';

  liberadoComprar = false;

  dataSorteio = '';

  sorteioId = 0;

  premios: any = [];

  semSorteio: any = {};

  recarregamentosUsados = 0;
  readonly maxRecarregamentos = 5;
  loadingRecarregar = false;

  visiblePix = false;
  dadosPagamento: any = {};
  tempoExpiracaoPix = '';

  pagamentoConfirmado = false;

  private countdownInterval?: ReturnType<typeof setInterval>;
  private readonly tempoExpiracaoSegundos = 10 * 60;

  private sseSubscription!: Subscription;

  constructor(
    private tituloService: TituloService, 
    private router : Router, 
    private message: MessageService,
    private pagamentoSseService: PagamentoSseService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    const elemento = this.botaoComprar?.nativeElement;

    if (elemento && elemento !== this.elementoObservado) {
      this.elementoObservado = elemento;
      this.observer?.disconnect();
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.botaoVisivel = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      this.observer.observe(elemento);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.pararContadorPix();
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }

  get quantidadeTitulosSelecionados(): number {
    return this.tituloComprar.filter((titulo: any) => titulo.selecionado).length;
  }

  get valorTotalSelecionado(): number {
    return this.tituloComprar
      .filter((titulo: any) => titulo.selecionado)
      .reduce((total: number, titulo: any) => total + (Number(titulo.preco) || 0), 0);
  }

  get recarregamentosRestantes(): number {
    return this.maxRecarregamentos - this.recarregamentosUsados;
  }

  get podeRecarregar(): boolean {
    return this.recarregamentosRestantes > 0 && !this.loadingRecarregar;
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor);
  }

  private normalizarTitulos(titulos: any[]): any[] {
    return titulos.map((titulo: any) => ({ ...titulo, selecionado: false }));
  }

  private iniciarContadorPix(): void {
    this.pararContadorPix();
    let segundosRestantes = this.tempoExpiracaoSegundos;
    this.atualizarTempoExpiracao(segundosRestantes);

    this.countdownInterval = setInterval(() => {
      segundosRestantes--;

      if (segundosRestantes <= 0) {
        this.atualizarTempoExpiracao(0);
        this.pararContadorPix();
        return;
      }

      this.atualizarTempoExpiracao(segundosRestantes);
    }, 1000);
  }

  private atualizarTempoExpiracao(segundos: number): void {
    if (segundos <= 0) {
      this.tempoExpiracaoPix = 'Tempo para pagamento expirado';
      return;
    }

    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    this.tempoExpiracaoPix = `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  }

  private pararContadorPix(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  entrar() {
    if(this.documento.replace(/\D/g, '').length == 11) {
      const cpfLimpo = this.documento.replace(/\D/g, '');

      this.cpfComprador = cpfLimpo;

      this.tituloService.isExistClient(cpfLimpo).subscribe({
        next: (data) => {
          this.visible = false;
          this.nomeComprador = data.nome;
          this.podeComprar = true;
          
          this.carregarTitulos();
        },
        error: (error) => {
          this.tituloService.getEstados().subscribe({
            next: (data) => {
              this.estados = data.map(e => { return {name: e.nome, code: e.sigla}; }) 
            }
          });
          this.initForm()
          this.precisaCadastrar = true;
        }
      });
      return;
    }
  }

  recarregar() {
    if (this.recarregamentosRestantes <= 0) {
      this.message.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Você já utilizou todas as recargas disponíveis.'
      });
      return;
    }

    this.loadingRecarregar = true;

    this.carregarTitulos();
  }

  private carregarTitulos() {
    this.tituloService.getTituloComprar().subscribe({
      next: (data) => {
        this.liberadoComprar = true;
        this.loadingRecarregar = false;
        this.tituloComprar = this.normalizarTitulos(data.titulos);
        this.dataSorteio = data.data;
        this.sorteioId = data.sorteioId;
        this.recarregamentosUsados++;
      },
      error: (error) => {
        this.loadingRecarregar = false;
        if (error.status === 422) {
          this.semSorteio = error.error;
          this.liberadoComprar = false;
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao recarregar títulos.'
          });
        }
      }
    });
  }

  comprar() {
    const selecionados = this.tituloComprar.filter((titulo: any) => titulo.selecionado);

    if (selecionados.length === 0) {
      this.message.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione ao menos uma cartela para comprar.'
      });
      return;
    }else {      
      this.tituloService.criarCompra(
        this.sorteioId, 
        this.cpfComprador, 
        selecionados.map((titulo: any) => titulo.numeroTitulo),
        selecionados.map((tilulo: any) => tilulo.titulosLista)
      ).subscribe({
        next: (data) => {
          // Monitora o status do pagamento
          
          this.sseSubscription = this.pagamentoSseService
            .streamStatusPagamento(data.identificador)
            .subscribe({
              next: (status) => {
                if (status === 'COMPLETED') { // ou outro status definido pelo seu banco
                  this.pagamentoConfirmado = true;
                }
              },
              error: (err) => console.error('Erro no SSE', err)
            });

          this.visiblePix = true;
          this.dadosPagamento = data;
          this.iniciarContadorPix();
        },
        error: (error) => {
          console.log(error)
          this.message.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar compra.'
          });
        }
      });
    }
  }

  async copiarConteudo(texto: string) {
    try {
    await navigator.clipboard.writeText(texto);
    this.message.add({severity: 'info', summary: 'Informativo', detail: 'Código do PIX \ncopiado com sucesso!'});
    } catch (err) {
      console.log('Erro ao copiar: ', err);
    }
  }

  irParaConsulta(): void {
    this.finalizarPagamento();
    this.router.navigate(['/']);
  }

  irParaResultado(): void {
    this.finalizarPagamento();
    this.router.navigate(['/resultado']);
  }

  private finalizarPagamento(): void {
    this.visiblePix = false;
    this.pagamentoConfirmado = false;
    this.pararContadorPix();

    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }

  initForm() {
    this.myForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cpf: new FormControl(this.documento, [Validators.required ]),
      celular: new FormControl('', Validators.required),
      uf: new FormControl('', []),
      municipio: new FormControl('', Validators.required),
      email: new FormControl('', [])
    });
  }

  getMunicipios(event: any) {
    this.loading = true;
    this.tituloService.getMunicipios(event.value).subscribe({
      next: (data) => {
        this.loading = false;
        this.municipios = data.map(m => {return {name: m, code: m}});
      }
    });
  }

  cadastrar() {
    if (this.myForm.valid) {
      const body = this.myForm.value;

      this.tituloService.salvarCliente(body).subscribe({
        next: (data) => {
          this.tituloService.getTituloComprar().subscribe({
            next: (data) => {
              this.tituloComprar = data;
            }
          });
          
          this.visible = false;
          this.nomeComprador = body.nome;
          this.podeComprar = true;
          //this.loadingSave = false;
        },
        error: (data) => {
          console.log(data);
          //this.loadingSave = false;
        },
      })
    }
  }
}
