import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationStats from '../../components/ApplicationStats';
import { ApplicationStats as ApplicationStatsType } from '../../types';

// Mock data pour les tests
const mockStats: ApplicationStatsType = {
  total: 10,
  pending: 3,
  interview: 2,
  rejected: 4,
  accepted: 1
};

describe('ApplicationStats', () => {
  test('affiche le nombre total de candidatures', () => {
    render(<ApplicationStats stats={mockStats} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('affiche le nombre de candidatures en attente', () => {
    render(<ApplicationStats stats={mockStats} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  test('affiche le nombre de candidatures en entretien', () => {
    render(<ApplicationStats stats={mockStats} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Entretien')).toBeInTheDocument();
  });

  test('affiche le nombre de candidatures refusées', () => {
    render(<ApplicationStats stats={mockStats} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Refusées')).toBeInTheDocument();
  });

  test('affiche le nombre de candidatures acceptées', () => {
    render(<ApplicationStats stats={mockStats} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Acceptées')).toBeInTheDocument();
  });

  test('affiche zéro pour toutes les statistiques quand il n\'y a pas de candidatures', () => {
    const emptyStats: ApplicationStatsType = {
      total: 0,
      pending: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    };

    render(<ApplicationStats stats={emptyStats} />);

    expect(screen.getAllByText('0')).toHaveLength(5);
  });

  test('affiche toutes les statistiques avec les bonnes couleurs', () => {
    render(<ApplicationStats stats={mockStats} />);

    // Vérifier que tous les éléments sont présents
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
    expect(screen.getByText('Entretien')).toBeInTheDocument();
    expect(screen.getByText('Refusées')).toBeInTheDocument();
    expect(screen.getByText('Acceptées')).toBeInTheDocument();

    // Vérifier que les nombres sont affichés
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('gère les statistiques avec des nombres élevés', () => {
    const largeStats: ApplicationStatsType = {
      total: 150,
      pending: 45,
      interview: 30,
      rejected: 60,
      accepted: 15
    };

    render(<ApplicationStats stats={largeStats} />);

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('affiche correctement les statistiques avec des valeurs uniques', () => {
    const uniqueStats: ApplicationStatsType = {
      total: 5,
      pending: 1,
      interview: 1,
      rejected: 1,
      accepted: 1
    };

    render(<ApplicationStats stats={uniqueStats} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
