import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { RideRequestRepository } from '../repositories/ride-request.repository';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface LocationDto extends GeoPoint {
  address: string;
}

interface CreateRideRequestDto {
  rideId: string;
  passengerId: string;
  seatsNeeded: number;
  message?: string;
  pickupLocation?: LocationDto;
  dropoffLocation?: LocationDto;
}

interface UpdateRequestStatusDto {
  status: RequestStatus;
}

interface GetRequestsWithinRadiusDto {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

interface GetRequestsByRouteDto {
  routeGeometry: string;
  maxDistance?: number;
}

interface RequestStatisticsQuery {
  rideId?: string;
  passengerId?: string;
}

@Injectable()
export class RideRequestService {
  constructor(private readonly rideRequestRepository: RideRequestRepository) {}

  /**
   * Criar uma nova solicitação de carona
   */
  async createRideRequest(dto: CreateRideRequestDto): Promise<{}> {
    this.validateCreateRideRequestDto(dto);

    try {
      const request = await this.rideRequestRepository.create({
        rideId: dto.rideId,
        passengerId: dto.passengerId,
        seatsNeeded: dto.seatsNeeded,
        message: dto.message,
        pickupLocation: dto.pickupLocation,
        dropoffLocation: dto.dropoffLocation,
      });

      return {
        success: true,
        data: request,
        message: 'Solicitação de carona criada com sucesso',
      };
    } catch (error) {
      if (error.message === 'Ride not found') {
        throw new NotFoundException('Carona não encontrada');
      }
      console.error('Error creating ride request:', error);
      throw new BadRequestException('Erro ao criar solicitação de carona');
    }
  }

  /**
   * Buscar solicitação por ID
   */
  async findRideRequestById(id: string) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    const request = await this.rideRequestRepository.findById(id);

    if (!request) {
      throw new NotFoundException('Solicitação de carona não encontrada');
    }

    return {
      success: true,
      data: request,
    };
  }

  /**
   * Buscar solicitações por ID da carona
   */
  async findRideRequestsByRideId(rideId: string) {
    if (!rideId) {
      throw new BadRequestException('ID da carona é obrigatório');
    }

    const requests = await this.rideRequestRepository.findByRideId(rideId);

    return {
      success: true,
      data: requests,
      count: requests.length,
    };
  }

  /**
   * Buscar solicitações por ID do passageiro
   */
  async findRideRequestsByPassengerId(passengerId: string, status?: string) {
    if (!passengerId) {
      throw new BadRequestException('ID do passageiro é obrigatório');
    }

    if (status && !this.isValidRequestStatus(status)) {
      throw new BadRequestException('Status de solicitação inválido');
    }

    const requests = await this.rideRequestRepository.findByPassengerId(
      passengerId,
      status,
    );

    return {
      success: true,
      data: requests,
      count: requests.length,
    };
  }

  /**
   * Atualizar status de uma solicitação
   */
  async updateRequestStatus(id: string, dto: UpdateRequestStatusDto) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    if (!this.isValidRequestStatus(dto.status)) {
      throw new BadRequestException('Status de solicitação inválido');
    }

    try {
      const updatedRequest = await this.rideRequestRepository.updateStatus(
        id,
        dto.status,
      );

      return {
        success: true,
        data: updatedRequest,
        message: 'Status da solicitação atualizado com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar status da solicitação');
    }
  }

  /**
   * Aceitar uma solicitação de carona
   */
  async acceptRideRequest(id: string) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    try {
      const acceptedRequest = await this.rideRequestRepository.acceptRequest(id);

      return {
        success: true,
        data: acceptedRequest,
        message: 'Solicitação de carona aceita com sucesso',
      };
    } catch (error) {
      if (error.message === 'Request not found') {
        throw new NotFoundException('Solicitação de carona não encontrada');
      }
      if (error.message === 'Not enough available seats') {
        throw new ConflictException('Não há assentos suficientes disponíveis');
      }
      throw new BadRequestException('Erro ao aceitar solicitação de carona');
    }
  }

  /**
   * Rejeitar uma solicitação de carona
   */
  async rejectRideRequest(id: string) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    try {
      const rejectedRequest = await this.rideRequestRepository.rejectRequest(id);

      return {
        success: true,
        data: rejectedRequest,
        message: 'Solicitação de carona rejeitada com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao rejeitar solicitação de carona');
    }
  }

  /**
   * Cancelar uma solicitação de carona
   */
  async cancelRideRequest(id: string) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    try {
      const cancelledRequest = await this.rideRequestRepository.cancelRequest(id);

      return {
        success: true,
        data: cancelledRequest,
        message: 'Solicitação de carona cancelada com sucesso',
      };
    } catch (error) {
      if (error.message === 'Request not found') {
        throw new NotFoundException('Solicitação de carona não encontrada');
      }
      throw new BadRequestException('Erro ao cancelar solicitação de carona');
    }
  }

  /**
   * Buscar solicitações dentro de um raio
   */
  async getRequestsWithinRadius(dto: GetRequestsWithinRadiusDto) {
    this.validateCoordinates(dto.latitude, dto.longitude);

    const radiusMeters = dto.radiusMeters || 5000;

    if (radiusMeters <= 0 || radiusMeters > 50000) {
      throw new BadRequestException('Raio deve estar entre 1 e 50000 metros');
    }

    try {
      const requests = await this.rideRequestRepository.getRequestsWithinRadius(
        dto.latitude,
        dto.longitude,
        radiusMeters,
      );

      return {
        success: true,
        data: requests,
        count: (requests as []).length,
        radius: radiusMeters,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar solicitações na área');
    }
  }

  /**
   * Buscar solicitações por rota
   */
  async getRequestsByRoute(dto: GetRequestsByRouteDto) {
    if (!dto.routeGeometry) {
      throw new BadRequestException('Geometria da rota é obrigatória');
    }

    const maxDistance = dto.maxDistance || 1000;

    if (maxDistance <= 0 || maxDistance > 10000) {
      throw new BadRequestException('Distância máxima deve estar entre 1 e 10000 metros');
    }

    try {
      const requests = await this.rideRequestRepository.getRequestsByRoute(
        dto.routeGeometry,
        maxDistance,
      );

      return {
        success: true,
        data: requests,
        count: (requests as []).length,
        maxDistance,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar solicitações por rota');
    }
  }

  /**
   * Obter estatísticas das solicitações
   */
  async getRequestStatistics(query: RequestStatisticsQuery) {
    try {
      const statistics = await this.rideRequestRepository.getRequestStatistics(
        query.rideId,
        query.passengerId,
      );

      return {
        success: true,
        data: statistics,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao obter estatísticas das solicitações');
    }
  }

  /**
   * Buscar solicitações pendentes para motorista
   */
  async findPendingRequestsForDriver(driverId: string) {
    if (!driverId) {
      throw new BadRequestException('ID do motorista é obrigatório');
    }

    try {
      const requests = await this.rideRequestRepository.findPendingRequestsForDriver(
        driverId,
      );

      return {
        success: true,
        data: requests,
        count: requests.length,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar solicitações pendentes');
    }
  }

  /**
   * Atualizar status de pickup (usando método genérico updateStatus)
   */
  async updatePickupStatus(
    id: string,
    status: 'ACCEPTED' | 'REJECTED' | 'ON_GOING',
  ) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    if (!['ACCEPTED', 'REJECTED', 'ON_GOING'].includes(status)) {
      throw new BadRequestException('Status de pickup inválido');
    }

    try {
      const updatedRequest = await this.rideRequestRepository.updatePickupStatus(
        id,
        status,
      );

      return {
        success: true,
        data: updatedRequest,
        message: 'Status de pickup atualizado com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar status de pickup');
    }
  }

  /**
   * Atualizar status de dropoff (usando método genérico updateStatus)
   */
  async updateDropoffStatus(id: string) {
    if (!id) {
      throw new BadRequestException('ID da solicitação é obrigatório');
    }

    try {
      const updatedRequest = await this.rideRequestRepository.updateDropoffStatus(
        id,
        'COMPLETED',
      );

      return {
        success: true,
        data: updatedRequest,
        message: 'Passageiro foi deixado com sucesso',
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar status de dropoff');
    }
  }

  /**
   * Atualizar status em lote (usando updateStatus sequencialmente)
   */
  async bulkUpdateStatus(requestIds: string[], status: RequestStatus) {
    if (!requestIds || requestIds.length === 0) {
      throw new BadRequestException('Lista de IDs das solicitações é obrigatória');
    }

    if (!this.isValidRequestStatus(status)) {
      throw new BadRequestException('Status de solicitação inválido');
    }

    try {
      const result = await this.rideRequestRepository.bulkUpdateStatus(
        requestIds,
        status,
      );

      return {
        success: true,
        data: result,
        message: `${result.count} solicitações foram atualizadas com sucesso`,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar solicitações em lote');
    }
  }

  // Métodos privados de validação
  private validateCreateRideRequestDto(dto: CreateRideRequestDto) {
    if (!dto.rideId) {
      throw new BadRequestException('ID da carona é obrigatório');
    }

    if (!dto.passengerId) {
      throw new BadRequestException('ID do passageiro é obrigatório');
    }

    if (!dto.seatsNeeded || dto.seatsNeeded <= 0 || dto.seatsNeeded > 8) {
      throw new BadRequestException('Número de assentos deve estar entre 1 e 8');
    }

    if (dto.pickupLocation && !this.isValidLocation(dto.pickupLocation)) {
      throw new BadRequestException('Localização de embarque inválida');
    }

    if (dto.dropoffLocation && !this.isValidLocation(dto.dropoffLocation)) {
      throw new BadRequestException('Localização de desembarque inválida');
    }

    if (dto.message && dto.message.length > 500) {
      throw new BadRequestException('Mensagem não pode exceder 500 caracteres');
    }
  }

  private isValidLocation(location: LocationDto): boolean {
    return (
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      typeof location.address === 'string' &&
      location.latitude >= -90 &&
      location.latitude <= 90 &&
      location.longitude >= -180 &&
      location.longitude <= 180 &&
      location.address.trim().length > 0
    );
  }

  private validateCoordinates(latitude: number, longitude: number) {
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException('Coordenadas inválidas');
    }
  }

  private isValidRequestStatus(status: string): boolean {
    const validStatuses = [
      'PENDING',
      'ACCEPTED',
      'REJECTED',
      'CANCELLED',
      'ON_GOING',
      'COMPLETED',
    ];
    return validStatuses.includes(status);
  }
}